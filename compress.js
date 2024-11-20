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
            .jpeg({ quality: 70 })  // Adjust quality as needed
            .png({ compressionLevel: 9 })  // Adjust compression level as needed
            .webp({ quality: 70 })  // Adjust quality as needed
            .tiff({ quality: 70 })  // Adjust quality as needed
            .toFile(outputPath);
        console.log(`Compressed: ${inputPath} -> ${outputPath}`);
        
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

// Main function to start the process
(async function main() {
    try {
        await processDirectory(inputDir);
        console.log('All images processed successfully.');
    } catch (err) {
        console.error('Error processing images:', err);
    }
})();
