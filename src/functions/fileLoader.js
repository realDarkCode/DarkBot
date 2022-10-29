const { glob } = require("glob");
const { promisify } = require("util");

const promisifyGlob = promisify(glob);

async function loadFiles(directoryName) {
  const files = await promisifyGlob(
    `${process.cwd().replace(/\\/g, "/")}/src/${directoryName}/**/*.js`
  );
  // Removing previously cached files
  files.forEach((file) => delete require.cache[require.resolve(file)]);

  return files;
}

module.exports = { loadFiles };
