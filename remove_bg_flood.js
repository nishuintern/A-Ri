const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeBackground(imageName) {
  const filePath = path.join(__dirname, 'public', imageName);
  const tempPath = path.join(__dirname, 'public', 'temp_' + imageName);
  
  if (!fs.existsSync(filePath)) return;

  try {
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    
    // Get top-left pixel color as background
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];
    
    const tolerance = 35; // Euclidean distance

    // Queue for flood fill
    const queue = [[0, 0]];
    const visited = new Uint8Array(width * height);
    visited[0] = 1;

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const idx = (y * width + x) * 4;
      
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
      
      if (dist < tolerance) {
        data[idx + 3] = 0; // Make transparent
        
        // Add neighbors
        const neighbors = [
          [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
        ];
        
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            if (!visited[nIdx]) {
              visited[nIdx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    await sharp(data, {
      raw: { width, height, channels: 4 }
    })
    .png()
    .toFile(tempPath);

    fs.renameSync(tempPath, filePath);
    console.log(`Successfully removed background via flood fill: ${imageName}`);
  } catch (err) {
    console.error(`Error on ${imageName}:`, err);
  }
}

async function run() {
  await removeBackground('flavor_salt.png');
  await removeBackground('flavor_truffle.png');
  await removeBackground('flavor_herbes.png');
}

run();
