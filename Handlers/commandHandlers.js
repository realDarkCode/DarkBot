const { Client } = require("discord.js");

const fs = require("fs");
const ascii = require("ascii-table");
/**
 *
 * @param {Client} client
 */
const loadCommands = (client) => {
  const table = new ascii().setHeading("Commands");
  const commandsArray = [];
  const developersArray = [];
  const commandFolders = fs.readdirSync("./Commands");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../Commands/${folder}/${file}`);

      client.commands.set(commandFile.data.name, commandFile);

      if (commandFile.developer)
        developersArray.push(commandFile.data.toJSON());
      else commandsArray.push(commandFile.data.toJSON());

      table.addRow(commandFile.data.name, "🟩");
    }
  }

  client.application.commands.set(commandsArray);
  if (process.env.developmentGuild) {
    const developmentGuild = client.guilds.cache.get(
      process.env.developmentGuild
    );
    developmentGuild.commands.set(developersArray);
  }
  console.info(table.render());
};

module.exports = loadCommands;
