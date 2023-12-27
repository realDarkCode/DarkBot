const { ChatInputCommandInteraction } = require("discord.js");
const { loadCommands } = require("../../../handlers");

module.exports = {
  subCommand: "reload.commands",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const client = interaction.client;
    const commandList = await loadCommands(client);
    interaction.reply({
      content: `loaded ${commandList.length} commands`,
      ephemeral: true,
    });
  },
};
