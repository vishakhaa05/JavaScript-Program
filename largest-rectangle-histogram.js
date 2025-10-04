// Largest Rectangle in Histogram
// Time Complexity: O(n), Space Complexity: O(n)
//
// Idea: Use a stack to keep track of indices of bars in increasing order.
// Whenever we find a bar that is smaller than the bar at the stack's top,
// we pop from the stack and calculate the area with that bar as the smallest height.

function largestRectangleArea(heights) {
  const stack = []; // stack will hold indices of the bars
  let maxArea = 0;

  // Loop through all bars including an extra iteration (with height 0)
  for (let i = 0; i <= heights.length; i++) {
    const currentHeight = (i === heights.length) ? 0 : heights[i];

    // If current bar is lower, start popping from stack
    while (stack.length && currentHeight < heights[stack[stack.length - 1]]) {
      const poppedIndex = stack.pop();
      const height = heights[poppedIndex];

      // If stack is empty, width is i (from beginning to i-1)
      // Otherwise width is distance between current index and new top of stack
      const leftBoundary = stack.length ? stack[stack.length - 1] : -1;
      const width = i - leftBoundary - 1;

      maxArea = Math.max(maxArea, height * width);
    }

    // Push current index onto stack
    stack.push(i);
  }

  return maxArea;
}

// Quick test example
if (require.main === module) {
  console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // Expected output: 10
}

module.exports = largestRectangleArea;
