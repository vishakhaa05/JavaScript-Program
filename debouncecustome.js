function debounceCustom(func, delay = 300) {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Example usage
const handleInput = debounceCustom((event) => {
  console.log('Search query:', event.target.value);
}, 500);

document.getElementById('searchInput').addEventListener('input', handleInput);
