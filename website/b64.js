const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const publicPath = path.join(__dirname, 'public');

async function generateBase64Images() {
  try {
    const files = await fs.readdir(publicPath);
    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return extension === '.png';
    });

    const imagePromises = imageFiles.map((file) => {
      const filePath = path.join(publicPath, file);
      return sharp(filePath)
        .resize(40, 40)
        .toBuffer()
        .then((data) => ({
          name: file.split('.')[0],
          data: data.toString('base64'),
        }));
    });

    const images = await Promise.all(imagePromises);

    const imagesObject = images.reduce((acc, {name, data}) => {
      acc[name] = data;
      return acc;
    }, {});

    const json = JSON.stringify(imagesObject, null, 2);
    await fs.writeFile('images.json', json);
    console.log('Images saved to images.json');
  } catch (err) {
    console.error(err);
  }
}

generateBase64Images();
