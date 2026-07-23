const fs = require('fs');

const origStr = fs.readFileSync('original_expertise_utf8.tsx', 'utf8');
const origLines = origStr.split('\n');

// Find CommandTerminal in original
const ctStart = origLines.findIndex(l => l.includes('function CommandTerminal() {'));
let ctEnd = -1;
let openBraces = 0;
for (let i = ctStart; i < origLines.length; i++) {
    if (origLines[i].includes('{')) openBraces += (origLines[i].match(/\{/g) || []).length;
    if (origLines[i].includes('}')) openBraces -= (origLines[i].match(/\}/g) || []).length;
    
    if (openBraces === 0 && origLines[i].includes('}')) {
        ctEnd = i;
        break;
    }
}
const commandTerminalCode = origLines.slice(ctStart, ctEnd + 1).join('\n');

const currentStr = fs.readFileSync('src/components/ExpertiseSection.tsx', 'utf8');
const currentLines = currentStr.split('\n');

// Find Interactive3DGallery in current
const igStart = currentLines.findIndex(l => l.includes('function Interactive3DGallery() {'));
let igEnd = -1;
openBraces = 0;
for (let i = igStart; i < currentLines.length; i++) {
    if (currentLines[i].includes('{')) openBraces += (currentLines[i].match(/\{/g) || []).length;
    if (currentLines[i].includes('}')) openBraces -= (currentLines[i].match(/\}/g) || []).length;
    
    if (openBraces === 0 && currentLines[i].includes('}')) {
        igEnd = i;
        break;
    }
}

// Replace Interactive3DGallery definition with CommandTerminal
let newContent = currentLines.slice(0, igStart).join('\n') + '\n' + commandTerminalCode + '\n' + currentLines.slice(igEnd + 1).join('\n');

// Replace invocation
newContent = newContent.replace(/<Interactive3DGallery \/>/g, '<CommandTerminal />');

fs.writeFileSync('src/components/ExpertiseSection.tsx', newContent);
console.log('Swap complete.');
