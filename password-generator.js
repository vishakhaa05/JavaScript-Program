
// filename: password-generator.js
// Usage: node password-generator.js [length]
// Example: node password-generator.js 16

function generatePassword(length = 12) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  const allChars = upper + lower + numbers + symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  if (!password.match(/[A-Z]/)) password += upper[Math.floor(Math.random() * upper.length)];
  if (!password.match(/[a-z]/)) password += lower[Math.floor(Math.random() * lower.length)];
  if (!password.match(/[0-9]/)) password += numbers[Math.floor(Math.random() * numbers.length)];
  if (!password.match(/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/)) password += symbols[Math.floor(Math.random() * symbols.length)];

  return password.slice(0, length);
}

const [,, lengthArg] = process.argv;
const passwordLength = lengthArg ? parseInt(lengthArg, 10) : 12;

if (isNaN(passwordLength) || passwordLength <= 0) {
  console.log("Please provide a valid positive number for the password length.");
  process.exit(1);
}

const newPassword = generatePassword(passwordLength);
console.log(`Generated Password (${passwordLength} characters):`);
console.log(newPassword);
