const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next');

try {
  let content = fs.readFileSync(target, 'utf8');
  if (content.includes('IS_WEBPACK_TEST')) {
    console.log('next binary already patched for webpack');
    process.exit(0);
  }
  content = content.replace(
    '"use strict";',
    '"use strict";\nprocess.env.IS_WEBPACK_TEST = process.env.IS_WEBPACK_TEST || "1";'
  );
  fs.writeFileSync(target, content);
  console.log('Patched next binary to force webpack mode');
} catch (err) {
  console.error('Failed to patch next binary:', err.message);
  process.exit(0);
}
