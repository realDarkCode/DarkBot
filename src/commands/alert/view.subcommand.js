const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");
const { toDiscordTime } = require("../../helpers/date.js");

const getRecentLastSend = (schedule) => {
  const lastSends = schedule?.map((s) => s.lastSend).filter((date) => date);

  if (lastSends.length === 0) {
    return "`Never`";
  } else {
    const recentLastSend = new Date(
      Math.max(...lastSends.map((d) => d.getTime()))
    );
    return `<t:${Math.floor(recentLastSend.getTime() / 1000)}:R>`;
  }
};

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
        name: "Created At",
        value: `<t:${Math.floor(message.createdAt.getTime() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Last Send",
        value: getRecentLastSend(message.schedule),
        inline: true,
      },
      {
        name: "Repeat",
        value: message.schedule[0]?.repeat ? "`Yes`" : "`No`",
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
