const loadCommands = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  // Initialize the table for logging status
  const ascii = require("ascii-table");
  const table = new ascii("Commands Loaded").setHeading(
    "S/N",
    "Command",
    "Status"
  );

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
      else if (command.data) {
        client.commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        table.addRow(commandArray.length, command.data.name, "🟩");
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      table.addRow(
        commandArray.length,
        command.data?.name || commandFile.slice(-15),
        "🟥"
      );
    }
  });

  table.addRow("", "total", commandArray.length);
  // setting command to bot
  client.application.commands.set(commandArray);

  // log status
  const status = commandArray.length
    ? process.env.LOG_TABLE === "on"
      ? table.toString()
      : `${commandArray.length} commands loaded`
    : "No commands found";

  console.log(status);

  return commandArray;
};

module.exports = loadCommands;
