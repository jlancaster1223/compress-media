const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Input and output directories
const inputDir = 'input';
const outputDir = 'output';

// Function to compress images

async function compressImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize({ width: 1200, height: 1200, fit: 'inside' })
            .jpeg({ quality: 70 })  // Adjust quality as needed
            .png({ compressionLevel: 9 })  // Adjust compression level as needed
            .webp({ quality: 70 })  // Adjust quality as needed
            .toFile(outputPath);

        // Each time, add the amount saved to a total
        const inputStats = await fs.stat(inputPath);
        const outputStats = await fs.stat(outputPath);
        const savedBytes = inputStats.size - outputStats.size;
        console.log(`Saved: ${savedBytes} bytes`);
    } catch (err) {
        console.error(`Error compressing image ${inputPath}:`, err);
    }
}

// Recursively process directories and compress images
async function processDirectory(dirPath) {

    // Clear the output directory
    await fs.emptyDir(outputDir);

    const items = await fs.readdir(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativePath = path.relative(inputDir, fullPath);
        const outputPath = path.join(outputDir, relativePath);

        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
            // If it's a directory, recursively process it
            await fs.ensureDir(outputPath);  // Ensure the directory exists in the output folder
            await processDirectory(fullPath);
        } else if (stats.isFile()) {
            const ext = path.extname(fullPath).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                // Compress the image if it's in a valid format
                await fs.ensureDir(path.dirname(outputPath));  // Ensure the parent directory exists
                await compressImage(fullPath, outputPath);
            } else {
                // Optionally, you could copy non-image files to the output folder
                await fs.copy(fullPath, outputPath);
                console.log(`Copied (non-image): ${fullPath} -> ${outputPath}`);
            }
        }
    }
}

async function downloadImage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download image from ${url}`);
        }
        // response.buffer is not a function, so we have to use response.arrayBuffer() and then convert it to a Buffer
        const buffer = Buffer.from(await response.arrayBuffer());

        const name = path.basename(url);
        const cleanName = name.split('?')[0];

        // Download it to the input directory and keep the name
        const inputPath = path.join(inputDir, cleanName);
        await fs.writeFile(inputPath, buffer);

        // Set the output path to the same name in the output directory
        const outputPath = path.join(outputDir, cleanName);

        // Compress the shit out of it
        await compressImage(inputPath, outputPath);

        console.log(`Downloaded: ${url} -> ${outputPath}`);
    } catch (err) {
        console.error(`Error downloading image from ${url}:`, err);
    }
}

async function checkExternal() {
    // Check if there is a external.txt file.  If there is, we're going to download all the images from the URLs in the file then compress them, else, just compress what is in the input directory
    if (fs.existsSync('external.txt')) {
        const urls = fs.readFileSync('external.txt', 'utf8').split('\n');
        urls.forEach((url, index) => {
            downloadImage(url);
        });
    }
}

// Main function to start the process
(async function main() {
    try {

        await checkExternal();
        await processDirectory(inputDir);
        console.log('All images processed successfully.');
    } catch (err) {
        console.error('Error processing images:', err);
    }
})();

