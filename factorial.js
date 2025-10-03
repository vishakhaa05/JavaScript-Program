function factorial(n) {
  if (n < 0) return undefined;
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

// Example
console.log(factorial(5)); // 120
console.log(factorial(0)); // 1
