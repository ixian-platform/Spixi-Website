const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walk(p, filelist);
    } else if (file.endsWith('.html')) {
      filelist.push(p);
    }
  });
  return filelist;
}

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];

  // mobileMenu should include aria-hidden
  if (content.includes('id="mobileMenu"') && !content.includes('aria-hidden="true"')) {
    issues.push('mobileMenu missing aria-hidden');
  }

  // cookieSettings should include aria-hidden
  if (content.includes('id="cookieSettings"') && !content.includes('aria-hidden="true"')) {
    issues.push('cookieSettings missing aria-hidden');
  }

  if (issues.length > 0) {
    console.log(`\n${file}`);
    issues.forEach(i => console.log(`  - ${i}`));
  }
}

const allHtml = walk(process.cwd());
allHtml.forEach(file => checkFile(file));

console.log('\nARIA check completed');
