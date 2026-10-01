const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'images', 'UpdatePhoto');
const extensions = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i;

function sync() {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir)
    .filter(f => extensions.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(undefined, { numeric: true, sensitivity: 'base' }))
    .map(f => `images/UpdatePhoto/${f}`);

  const jsonPath = path.join(dir, 'photos.json');
  const jsPath = path.join(dir, 'photos.js');

  fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2) + '\n');
  fs.writeFileSync(
    jsPath,
    `// Auto-generated manifest for Build Gallery photos in images/UpdatePhoto\nwindow.UPDATE_PHOTOS = ${JSON.stringify(files, null, 2)};\n`
  );

  console.log(`[Build Gallery] Synced ${files.length} photos from images/UpdatePhoto`);
}

sync();

if (process.argv.includes('--watch') || process.argv.includes('-w')) {
  console.log(`[Build Gallery] Watching ${dir} for photo changes...`);
  let debounceTimeout;
  fs.watch(dir, (eventType, filename) => {
    if (filename && extensions.test(filename)) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        console.log(`[Build Gallery] Detected change: ${filename} (${eventType})`);
        sync();
      }, 300);
    }
  });
}
