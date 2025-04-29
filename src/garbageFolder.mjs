import fs from 'fs';
import path from 'path';


// Function to delete a garbage folder
export async function deleteGarbageFolder(basePath) {
    const folderPath = path.resolve(basePath, 'garbage');  // Use path.resolve for absolute path

    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`Garbage folder deleted `);
    } else {
        console.log(`No garbage folder found at ${folderPath}`);
    }
}

// Function to create a garbage folder of a specific size
export async function createGarbageFolder(basePath, sizeInGB) {
    const folderPath = path.resolve(basePath, 'garbage');  // Use path.resolve for consistency

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Use a unique file name with a timestamp to avoid conflicts
    const fileName = `placeholder_${Date.now()}_${sizeInGB}GB.bin`;
    const filePath = path.join(folderPath, fileName);

    const fileSizeInBytes = sizeInGB * 1024 ** 3;

    // Create a sparse file of the specified size
    const fd = fs.openSync(filePath, 'w');
    fs.writeSync(fd, Buffer.alloc(1), 0, 1, fileSizeInBytes - 1);
    fs.closeSync(fd);

    console.log(`Garbage folder created with size ${sizeInGB} GB.`);
    console.log(`Garbage file created: ${fileName}`);
}
