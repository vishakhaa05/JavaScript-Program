// filename: palindrome.js
// Run: node palindrome.js racecar
const input = process.argv[2];
if (!input) {
 console.log("Usage: node palindrome.js <string>");
 process.exit(1);
}
function isPalindrome(str) {
 const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
 return cleaned === cleaned.split("").reverse().join("");
}
console.log(`${input} → ${isPalindrome(input) ? "Palindrome" : "Not Palindrome"}`);
