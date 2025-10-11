/**
 * memoize.js
 * Generic memoize function with optional TTL and support for async functions.
 *
 * Usage:
 *   const fastFib = memoize(async (n) => { ... }, { ttl: 5000 });
 *   await fastFib(10);
 */

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function defaultSerializeArgs(args) {
  try {
    return JSON.stringify(args);
  } catch {
    // fallback: toString join
    return args.map(a => String(a)).join('|');
  }
}

/**
 * memoize(fn, options)
 * options:
 *   - ttl: milliseconds to keep cache entries (optional)
 *   - serialize: function(argsArray) => string (optional)
 *   - maxSize: maximum number of cache entries (optional; LRU eviction)
 */
function memoize(fn, options = {}) {
  const { ttl = 0, serialize = defaultSerializeArgs, maxSize = Infinity } = options;
  const cache = new Map(); // key -> { value, expiresAt, lastUsed }

  function setEntry(key, value) {
    const expiresAt = ttl > 0 ? Date.now() + ttl : Infinity;
    cache.set(key, { value, expiresAt, lastUsed: Date.now() });
    // enforce maxSize (simple LRU eviction)
    if (cache.size > maxSize) {
      // find least recently used
      let lruKey = null;
      let lruTime = Infinity;
      for (const [k, v] of cache) {
        if (v.lastUsed < lruTime) {
          lruTime = v.lastUsed;
          lruKey = k;
        }
      }
      if (lruKey !== null) cache.delete(lruKey);
    }
  }

  function getEntry(key) {
    const entry = cache.get(key);
    if (!entry) return undefined;
    // expired?
    if (entry.expiresAt !== Infinity && Date.now() > entry.expiresAt) {
      cache.delete(key);
      return undefined;
    }
    entry.lastUsed = Date.now();
    return entry.value;
  }

  return function memoized(...args) {
    const key = serialize(args);
    const existing = getEntry(key);
    if (existing !== undefined) {
      return existing;
    }

    try {
      const result = fn.apply(this, args);

      if (isPromise(result)) {
        // store the pending promise to dedupe concurrent calls
        setEntry(key, result);
        // if promise rejects, remove cache so future calls can retry
        result.catch(() => {
          // only remove if the cached value is the same promise
          const cur = cache.get(key);
          if (cur && cur.value === result) cache.delete(key);
        });
        return result;
      } else {
        setEntry(key, result);
        return result;
      }
    } catch (err) {
      throw err;
    }
  };
}

module.exports = memoize;
