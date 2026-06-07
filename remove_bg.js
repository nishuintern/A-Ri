const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetColor = [161, 147, 126]; // Beige color from user screenshot
const tolerance = 40; // Distance tolerance

async function processImage(imageName) {
  const filePath = path.join(__dirname, 'public', imageName);
  const tempPath = path.join(__dirname, 'public', 'temp_' + imageName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} not found`);
    return;
  }

  try {
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Iterate through pixels and make beige transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate color distance
      const distance = Math.sqrt(
        Math.pow(r - targetColor[0], 2) +
        Math.pow(g - targetColor[1], 2) +
        Math.pow(b - targetColor[2], 2)
      );

      if (distance < tolerance) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      } else if (distance < tolerance + 20) {
        // Smooth anti-aliasing edge
        const alpha = Math.floor(255 * ((distance - tolerance) / 20));
        data[i + 3] = Math.min(data[i + 3], alpha);
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(tempPath);

    // Overwrite original
    fs.renameSync(tempPath, filePath);
    console.log(`Processed ${imageName} successfully`);
  } catch (err) {
    console.error(`Error processing ${imageName}:`, err);
  }
}

async function run() {
  await processImage('flavor_salt.png');
  await processImage('flavor_truffle.png');
  await processImage('flavor_herbes.png');
}

run();
