// filename: debounce.js
// Usage: node debounce.js
// Example demonstrates debounce with a simple simulated rapid calls.

function debounce(fn, wait) {
  let timeoutId = null;
  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, wait);
  }
}

// Example:
function onResize() {
  console.log('Resized at', new Date().toISOString());
}

const debouncedResize = debounce(onResize, 300);

// Simulate rapid calls:
let i = 0;
const interval = setInterval(() => {
  debouncedResize();
  i++;
  if (i >= 10) clearInterval(interval);
}, 50);
