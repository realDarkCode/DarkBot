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
          { name: "5min", value: 5 },
          { name: "20min", value: 20 },
          { name: "30min", value: 30 },
          { name: "45min", value: 45 },
          { name: "1hour", value: 30 },
          { name: "1hour 30 minutes", value: 90 },
          { name: "2hours", value: 120 },
          { name: "3hours", value: 180 },
          { name: "4hours", value: 240 },
          { name: "6hours", value: 300 }
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

    const guildID = interaction.guild.id;
    const notify = await notifyService.createNotification({
      userID: interaction.user.id,
      userTag: interaction.user.tag,
      recipientID,
      message,
      guildID,
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
