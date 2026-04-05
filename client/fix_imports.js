const fs = require('fs');
const path = require('path');

const dir = path.join('src', 'components', 'ui');
if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace: from "pkg@ver" -> from "pkg"
        // Also handle potential scoped packages or different quote styles if needed, 
        // but standard double quotes as seen in file view:
        const newContent = content.replace(/from "([^"]+)@[\d.]+"/g, 'from "$1"');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Fixed ${file}`);
        }
    });
} else {
    console.log("Directory not found: " + dir);
}
