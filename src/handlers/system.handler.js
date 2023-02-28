const loadSystems = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  const systems = await loadFiles("systems");

  systems.forEach((systemFile) => {
    const system = require(systemFile);
    try {
      system(client);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = loadSystems;
