const fs = require('fs');
const path = require('path');

const replacements = [
  { search: 'SYSTEM_OVERRIDE_ACTIVE', replace: 'LOADING' },
  { search: 'SYS_OK', replace: 'OK' },
  { search: 'SYS_READOUT', replace: 'READOUT' },
  { search: 'System Status: Secure', replace: 'Status: Secure' },
  { search: '"SYS_${targetModule.title', replace: '"${targetModule.title' },
  { search: 'SYS"', replace: '"' },
  { search: 'SYSTEM CAPABILITIES', replace: 'CAPABILITIES' },
  { search: 'System Version', replace: 'Version' },
  { search: 'System Offline', replace: 'Offline' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('src');
let changedFilesCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(r => {
      content = content.split(r.search).join(r.replace);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
        changedFilesCount++;
    }
});
console.log('Total files changed:', changedFilesCount);
