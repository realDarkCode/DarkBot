const loadCommands = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  // Initialize the table for logging status
  const ascii = require("ascii-table");
  const table = new ascii("Commands").setHeading("Commands", "Status");

  // clear previous commands from cache
  await client.commands.clear();

  let commandArray = [];

  const commands = await loadFiles("commands");

  // looping through every command file
  commands.forEach((commandFile) => {
    const command = require(commandFile);
    try {
      client.commands.set(command.data.name, command);
      commandArray.push(command.data.toJSON());

      table.addRow(command.name, "🟩");
    } catch (error) {
      console.log(error);
      table.addRow(command.name, "🟥");
    }
  });

  // setting command to bot
  client.application.commands.set(commandArray);

  // log status
  if (table.__rows.length)
    console.log(table.toString(), `\n${commands.length} Commands Loaded`);
  else console.log("No commands found");
};

module.exports = loadCommands;
