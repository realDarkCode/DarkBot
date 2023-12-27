const { ChatInputCommandInteraction } = require("discord.js");
const { loadComponents } = require("../../../handlers");

module.exports = {
  subCommand: "reload.components",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const client = interaction.client;
    const componentList = await loadComponents(client);
    interaction.reply({
      content: `loaded ${componentList.length} components`,
      ephemeral: true,
    });
  },
};
