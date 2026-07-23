const fs = require('fs');

let content = fs.readFileSync('src/components/ExpertiseSection.tsx', 'utf8');

// Replace globally since the only red is the terminal we just added
content = content.replace(/#FF0000/gi, '#ffd400');
content = content.replace(/rgba\(255,0,0,/gi, 'rgba(255, 212, 0,');
content = content.replace(/#FF3333/gi, '#ffdf33');

fs.writeFileSync('src/components/ExpertiseSection.tsx', content);
console.log('Color swap complete.');
