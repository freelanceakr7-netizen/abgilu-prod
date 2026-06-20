const fs = require('fs');
const path = require('path');

const srcPaths = ['src', 'pages', 'components'];
const counts = {};

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/\b(bg|text|border|ring)-(white|black|gray-\d+|red-\d+|indigo-\d+|blue-\d+|yellow-\d+|green-\d+|transparent|terracotta|kora|gold)\b/g);
      if (matches) {
        matches.forEach(m => {
          counts[m] = (counts[m] || 0) + 1;
        });
      }
    }
  }
}

srcPaths.forEach(p => scanDir(path.join(__dirname, p)));

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log(sorted.slice(0, 30));
