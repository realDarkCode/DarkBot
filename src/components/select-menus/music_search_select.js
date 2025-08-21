const { StringSelectMenuInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "music_search_select",
  },
  /**
   * @param {StringSelectMenuInteraction} interaction
   */
  async execute(interaction) {
    // This is handled directly in the search command
    // This file exists as a placeholder for the component handler
    await interaction.reply({
      content: "This interaction is handled elsewhere.",
      ephemeral: true,
    });
  },
};
