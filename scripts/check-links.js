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

  // Check for href="download" or href="/download"
  const downloadMatches = content.match(/href=\"(?:\/?download)(?:\")/g);
  if (downloadMatches) {
    issues.push(`Found non-canonical download link(s): ${downloadMatches.join(', ')}`);
  }

  // Check for href="privacy" or href="/privacy"
  const privacyMatches = content.match(/href=\"(?:\/?privacy)(?:\")/g);
  if (privacyMatches) {
    issues.push(`Found non-canonical privacy link(s): ${privacyMatches.join(', ')}`);
  }

  // Check for href="terms" or href="/terms"
  const termsMatches = content.match(/href=\"(?:\/?terms)(?:\")/g);
  if (termsMatches) {
    issues.push(`Found non-canonical terms link(s): ${termsMatches.join(', ')}`);
  }

  // Check for missing target ids for #mini-apps (should be full page link)
  const miniAppsHash = content.match(/href=\"#mini-apps\"/g);
  if (miniAppsHash) {
    issues.push(`Found in-page '#mini-apps' link in ${file} - consider using /mini-apps.html`);
  }

  // Reports
  if (issues.length > 0) {
    console.log(`\n${file}`);
    issues.forEach(i => console.log(`  - ${i}`));
  }
}

const allHtml = walk(process.cwd());
allHtml.forEach(file => checkFile(file));

console.log('\nLink check completed');
