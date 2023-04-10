const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("generate a  test button "),
  async execute(interaction) {
    const button = new ButtonBuilder()
      .setCustomId("music")
      .setLabel("music")
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
