const loadComponents = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  // Initialize the table for logging status
  const ascii = require("ascii-table");
  const table = new ascii("Components").setHeading(
    "SL",
    "Components",
    "Status"
  );

  // clear previous components from cache
  await client.components.clear();

  const components = await loadFiles("components");

  // looping through every command file
  components.forEach((componentFile, index) => {
    const component = require(componentFile);
    try {
      client.components.set(component.data.name, component);
    } catch (error) {
      console.log(error);
      table.addRow(index + 1, component.data.name, "🟥");
    }
  });

  // log status
  if (table.__rows.length)
    console.log(table.toString(), `\n${components.length} Components Loaded`);
};

module.exports = loadComponents;
