const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");
const { toDiscordTime } = require("../../helpers/date.js");

module.exports = {
  subCommand: "alert.view",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const id = interaction.options.getString("id");

    const message = await AlertMessage.findOne({ shortId: id });
    if (!message) {
      return interaction.reply({
        content: "No scheduled message found with that ID.",
      });
    }

    const embed = new EmbedBuilder().setTitle("Scheduled Message").setFields([
      { name: "ID", value: `\`${message.shortId}\``, inline: true },
      { name: "Channel", value: `<#${message.channelId}>`, inline: true },
      {
        name: "Last Send",
        value: message.lastSend
          ? `<t:${toDiscordTime(message.lastSend)}:R>`
          : "`Never`",
        inline: true,
      },

      {
        name: "Schedule",
        value: `\`${message.schedule
          .map((s) => `${s.day} ${s.time}`)
          .join(", ")}\``,
      },

      { name: "Message", value: message.message },
    ]);

    interaction.reply({ embeds: [embed] });
  },
};
