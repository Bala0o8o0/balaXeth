const fs = require('fs');
const path = require('path');
const keywords = ['sys', 'init', 'access', 'hacker', 'neural', 'telemetry', 'override', 'protocol', 'cyber', 'terminal', 'command', 'matrix', 'encrypt', 'decrypt', 'breach', 'mainframe', 'nexus', 'core', 'system', 'readout', 'glitch'];
const regex = new RegExp(keywords.join('|'), 'i');

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
let matches = [];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    lines.forEach((line, index) => {
        if (regex.test(line)) {
            matches.push({ file, line: index + 1, text: line.trim() });
        }
    });
});

console.log(JSON.stringify(matches.filter(m => m.text.includes('<') || m.text.includes('>') || m.text.includes('"') || m.text.includes("'") || m.text.includes('`')).slice(0, 100), null, 2));
console.log('Total matches:', matches.length);
