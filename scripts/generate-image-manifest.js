const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(__dirname, '../src/assets/image-manifest.json');
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'];

function walk(dir, base = '') {
  const manifest = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = path.join(base, entry.name);
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      Object.assign(manifest, walk(fullPath, relPath));
    } else {
      const ext = path.extname(entry.name).slice(1).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const key = relPath.slice(0, -(ext.length + 1)).replace(/\\/g, '/');
        manifest[key] = ext;
      }
    }
  }
  return manifest;
}

const outDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const manifest = walk(PUBLIC_DIR);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`Generated image manifest with ${Object.keys(manifest).length} entries`);
