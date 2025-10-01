// filename: anagram.js
// Run: node anagram.js listen silent

function isAnagram(str1, str2) {
  const clean = s => s.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
  return clean(str1) === clean(str2);
}

const [,, a, b] = process.argv;
if (!a || !b) {
  console.log("Usage: node anagram.js <word1> <word2>");
  process.exit(1);
}
console.log(`${a} & ${b} → ${isAnagram(a, b) ? "Anagrams" : "Not Anagrams"}`);
