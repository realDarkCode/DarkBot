const ascii = require("ascii-table");
const table = new ascii("Systems").setHeading("SL", "Systems", "Status");

const loadSystems = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  const systems = await loadFiles("systems");

  systems?.forEach((systemFile, index) => {
    try {
      const system = require(systemFile);
      system(client);
      table.addRow(
        index + 1,
        `${systemFile.split("\\").pop() || "MISSING"}`,
        `🟢 system loaded`
      );
    } catch (error) {
      console.log("error while reading system handler", error);
      table.addRow(
        index + 1,
        `${systemFile.split("\\").pop() || "MISSING"}`,
        `🔴 system failed to load`
      );
    }
  });

  // log status
  if (table.__rows.length && process.env.LOG) console.log(table.toString());
  if (table.__rows.length) console.log(`${systems.length} systems loaded`);
};

module.exports = loadSystems;
