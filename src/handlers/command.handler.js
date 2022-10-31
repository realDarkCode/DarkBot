const loadCommands = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  // Initialize the table for logging status
  const ascii = require("ascii-table");
  const table = new ascii("Commands").setHeading("SL", "Command", "Status");

  // clear previous commands from cache
  await client.commands.clear();
  await client.subCommands.clear();
  let commandArray = [];

  const commands = await loadFiles("commands");

  // looping through every command file
  commands.forEach((commandFile) => {
    const command = require(commandFile);
    try {
      if (command.subCommand)
        client.subCommands.set(command.subCommand, command);
      else {
        client.commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        table.addRow(commandArray.length, command.data.name, "🟩");
      }
    } catch (error) {
      console.log(error);
      table.addRow(commandArray.length, command.data.name, "🟥");
    }
  });

  // setting command to bot
  client.application.commands.set(commandArray);

  // log status
  if (table.__rows.length)
    // console.log(table.toString(), `\n${commandArray.length} Commands Loaded`);
    console.log(`${commandArray.length} Commands Loaded`);
  else console.log("No commands found");
};

module.exports = loadCommands;
