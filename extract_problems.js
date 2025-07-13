const fs = require('fs');
const path = require('path');
const SRC_DIR = './leetcode-java/src/';
const OUT_FILE = './public/problems.json';

if (!fs.existsSync(SRC_DIR)) {
  console.error('Clone fluency03/leetcode-java and set SRC_DIR to its src/leetcode folder.');
  process.exit(1);
}

const files = fs.readdirSync(SRC_DIR);
console.log(`Found ${files.length} files in ${SRC_DIR}`);

const javaFiles = files.filter(f => f.endsWith('.java'));
console.log(`Java files: ${javaFiles}`); // Log only .java files

const problems = javaFiles.map(filename => {
  const code = fs.readFileSync(path.join(SRC_DIR, filename), 'utf8');
  const match = filename.match(/^([A-Za-z]+)(\d+)\.java$/); // Match the pattern: Title + Number
  if (!match) return null;
  return {
    number: match[2], // Extract the number
    title: match[1].replace(/([a-z])([A-Z])/g, '$1 $2'), // Convert camel case to space-separated words
    code,
  };
}).filter(Boolean);

if (!fs.existsSync('./public')) fs.mkdirSync('./public');
fs.writeFileSync(OUT_FILE, JSON.stringify(problems, null, 2));
console.log(`Extracted ${problems.length} problems to ${OUT_FILE}`);