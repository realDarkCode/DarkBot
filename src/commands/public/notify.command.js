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
          { name: "15 min", value: 15 },
          { name: "30 min", value: 30 },
          { name: "45 min", value: 45 },
          { name: "1 hour", value: 30 },
          { name: "1 hour 30 minutes", value: 90 },
          { name: "3 hours", value: 3 * 60 },
          { name: "6 hours", value: 6 * 60 },
          { name: "8 hours", value: 8 * 60 },
          { name: "12 hours", value: 12 * 60 },
          { name: "16 hours", value: 16 * 60 },
          { name: "1 Days", value: 24 * 60 },
          { name: "2 Days", value: 2 * 24 * 60 },
          { name: "3 Days", value: 3 * 24 * 60 }
        )
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("set the message for the notify [max 4000 characters]")
        .setMaxLength(4000)
        .setMinLength(3)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("recipient")
        .setDescription("set the user for the notify [mention the @user]")
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription(
          "Give the exact image link which will be attached to the message [max 350 length]"
        )
        .setMaxLength(350)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const embed = new EmbedBuilder().setTitle("Notify");

    const time = interaction.options.getNumber("time");
    const message = interaction.options
      .getString("message")
      ?.replace(/(\\n)/g, "\n");
    let notifyTime = new Date();

    notifyTime = new Date(notifyTime.setSeconds(0) + time * 60000);
    const recipient = interaction.options.getUser("recipient");

    const recipientID = recipient?.id;
    const image = interaction.options.getString("image");

    if (recipientID === interaction.client.user.id)
      return interaction.reply({
        content: "I can't send a message to myself",
        ephemeral: true,
      });

    try {
      new EmbedBuilder().setDescription(message).setImage(image);
    } catch (error) {
      return await interaction.reply({
        content:
          "Error: Invalid message text or image link. Please enter a valid message and image link",
        ephemeral: true,
      });
    }

    const notify = await notifyService.createNotification({
      userID: interaction.user.id,
      userTag: interaction.user.tag,
      recipientID,
      message,
      image,
      time: notifyTime,
    });

    embed
      .setColor("Green")
      .setDescription(
        `Message scheduled successfully. Message will be send to <@${
          recipientID || interaction.user.id
        }> <t:${Math.round(notifyTime / 1000)}:R>.`
      )
      .setFooter({ text: `notify ID: ${notify._id}` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
