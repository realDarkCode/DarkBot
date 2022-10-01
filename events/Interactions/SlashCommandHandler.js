const { ChatInputCommandInteraction } = require("discord.js");
const config = require("../../config/bot");
module.exports = {
  name: "interactionCreate",

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {void} client
   * @returns {Promise<void>}
   */
  execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: "This command is outdated",
        ephemeral: true,
      });
    }
    if (
      command.developerOnly &&
      interaction.user.id !== config.development.developerID
    ) {
      return interaction.reply({
        content: "This command is only for  developer",
        ephemeral: true,
      });
    }

    command.execute(interaction);
  },
};
