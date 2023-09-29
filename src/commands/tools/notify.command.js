const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const notifyService = require("../../services/tools/notify.service");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notify")
    .setDescription("set an notify with a message")
    .addNumberOption((option) =>
      option
        .setName("time")
        .setDescription("set the time for the notify in minutes")
        .setRequired(true)
        .addChoices(
          { name: "5 min", value: 5 },
          { name: "20 min", value: 20 },
          { name: "30 min", value: 30 },
          { name: "45 min", value: 45 },
          { name: "1 hour", value: 30 },
          { name: "1 hour 30 minutes", value: 90 },
          { name: "2 hours", value: 2 * 60 },
          { name: "3 hours", value: 3 * 60 },
          { name: "4 hours", value: 4 * 60 },
          { name: "6 hours", value: 6 * 60 },
          { name: "12 hours", value: 12 * 60 },
          { name: "1 Days", value: 24 * 60 },
          { name: "3 Days", value: 3 * 24 * 60 }
        )
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("set the message for the notify")
        .setMaxLength(100)
        .setMinLength(3)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("recipient").setDescription("set the user for the notify")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const embed = new EmbedBuilder().setTitle("Notify");

    const time = interaction.options.getNumber("time");
    const message = interaction.options.getString("message");
    const notifyTime = new Date(Date.now() + time * 60000);
    const recipientID = interaction.options.getUser("recipient")?.id;

    if (recipientID === interaction.client.user.id)
      return interaction.reply({
        content: "I can't send a notification to myself",
        ephemeral: true,
      });

    const notify = await notifyService.createNotification({
      userID: interaction.user.id,
      userTag: interaction.user.tag,
      recipientID,
      message,
      time: notifyTime,
    });

    embed
      .setColor("Green")
      .setDescription(
        `Notification acknowledged. Notification will be send <t:${Math.round(
          notifyTime / 1000
        )}:R>.`
      )
      .setFooter({ text: `notify ID: ${notify._id}` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
