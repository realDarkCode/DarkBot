const loadComponents = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  let componentList = [];
  // Initialize the table for logging status
  const ascii = require("ascii-table");
  const table = new ascii("Components Loaded").setHeading(
    "S/N",
    "Component",
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
      table.addRow(index + 1, component.data.name, "🟩");
      componentList.push(component.data.name);
    } catch (error) {
      console.log(error);
      table.addRow(index + 1, component.data.name, "🟥");
    }
  });
  table.addRow("", "total", componentList.length);

  // log status
  if (table.__rows.length && process.env.LOG) console.log(table.toString());

  if (table.__rows.length)
    console.log(`${components.length} Components Loaded`);
  else console.log("No components found");
};

module.exports = loadComponents;
