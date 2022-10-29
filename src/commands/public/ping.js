const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, user } = interaction;
    const msg = await interaction.deferReply({ fetchReply: true });
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ iconURL: user.avatarURL(), name: user.tag })
      .setFields(
        {
          name: "🏓Latency",
          value: `\`${Math.round(
            msg.createdTimestamp - interaction.createdTimestamp
          )}ms\``,
          inline: false,
        },
        {
          name: "⚡ API Latency",
          value: `\`${Math.round(client.ws.ping)}ms\``,
          inline: false,
        }
      );
    await interaction.editReply({ embeds: [embed], content: "" });
  },
};
