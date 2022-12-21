const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
  ButtonInteraction,
} = require("discord.js");
const config = require("../../config/bot");
module.exports = {
  name: "interactionCreate",

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    if (!interaction.isButton()) return;
    const errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: "Error Occurred while interacting this button",
      })
      .setFooter({
        text: interaction.user.tag,
      })
      .setTimestamp();
    if (!interaction.isButton()) return;

    const button = client.components.get(interaction.customId);
    // if (!button) {
    //   return interaction.reply({
    //     content: "This interaction is outdated",
    //     ephemeral: true,
    //   });
    // }
    if (!button) return;
    if (
      button.developerOnly &&
      interaction.user.id !== config.development.developerID
    ) {
      return interaction.reply({
        content: "This command is only for  developer",
        ephemeral: true,
      });
    }
    try {
      await button.execute(interaction);
    } catch (error) {
      console.error(error);
      errorEmbed.setDescription(`
        \`Button ID:\` ${interaction.customId}
        \`Error:\` ${error.message}
        `);
      interaction.reply({
        embeds: [errorEmbed],
      });
    }
  },
};
