const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Reply with Pong 🏓"),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    return interaction.reply({ content: "Pong! 🏓", ephemeral: true });
  },
};
