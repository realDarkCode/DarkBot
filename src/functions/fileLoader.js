const fs = require('fs');
const path = require('path');

function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

async function loadFiles(directoryName) {
  try {
    const directoryPath = path.join(process.cwd(), "src", directoryName);
    const files = findJsFiles(directoryPath);

    files.forEach(file => {
      try {
        delete require.cache[require.resolve(file)];
      } catch (error) {
        console.error(`Error removing from cache: ${file}`, error);
      }
    });

    return files;
  } catch (error) {
    console.error("Error loading files:", error);
  }
}

module.exports = { loadFiles };