const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, size, size);

    // Text
    const text = 'NC';
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);

    return canvas;
}

const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

sizes.forEach(size => {
    const canvas = createIcon(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(publicDir, `logo${size}.png`), buffer);
    console.log(`Generated logo${size}.png`);
});