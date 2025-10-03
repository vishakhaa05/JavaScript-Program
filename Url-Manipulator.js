// Importing prompt-sync package
const prompt = require('prompt-sync')();

// Object to store the URLs
const urlDatabase = {};

// Function to generate a random short key
function generateShortKey() {
  return Math.random().toString(36).substring(2, 8); // Generates a random 6-character string
}

// Function to shorten a URL
function shortenURL(url) {
  const shortKey = generateShortKey();
  urlDatabase[shortKey] = url;
  return `short.ly/${shortKey}`;
}

// Function to expand a short URL back to the full URL
function expandURL(shortURL) {
  const shortKey = shortURL.split('/')[1];
  return urlDatabase[shortKey] || 'URL not found';
}

// Main flow: take user input and interact with the program
function main() {
  while (true) {
    // Take input on what action the user wants to perform
    const action = prompt('Enter "shorten" to shorten a URL, "expand" to expand a URL, or "exit" to quit: ').toLowerCase();

    if (action === 'shorten') {
      const url = prompt('Enter the URL to shorten: ');
      const shortURL = shortenURL(url);
      console.log('Shortened URL:', shortURL);
    } else if (action === 'expand') {
      const shortURL = prompt('Enter the shortened URL to expand: ');
      const fullURL = expandURL(shortURL);
      console.log('Expanded URL:', fullURL);
    } else if (action === 'exit') {
      console.log('Exiting the URL Shortener...');
      break;
    } else {
      console.log('Invalid option. Please try again.');
    }
  }
}

// Run the main function to start the program
main();
