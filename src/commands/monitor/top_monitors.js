const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
  getMonitorListWithPoints,
} = require("../../services/disciplineMonitor.service");

module.exports = {
  subCommand: "monitor.top_monitors",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const cls = "seven";
    const monitorListWithPoint = await getMonitorListWithPoints({ class: cls });

    const sortedMonitorList = monitorListWithPoint.sort((a, b) => {
      return b.point - a.point;
    });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Top Monitors from class ${cls}`)
          .setDescription(
            [
              "Top 10 Active Monitors:",
              `${sortedMonitorList.splice(0, 10).map((monitor, index, arr) => {
                if (arr.length) {
                  return `\n**${index + 1}**. \`${monitor.point}\` - ${
                    monitor.name
                  } - \`${monitor.school_id}\``;
                } else {
                  return `Not enough data found for this class to rank`;
                }
              })}`,
              ``,
              "",
              "Top 5 Inactive Monitors:",
              `${sortedMonitorList
                .splice(-5)
                .reverse()
                .map((monitor, index, arr) => {
                  if (arr.length) {
                    return `\n**${index + 1}**. \`${monitor.point}\` - ${
                      monitor.name
                    } - \`${monitor.school_id}\``;
                  } else {
                    return `Not enough data found for this class to rank`;
                  }
                })}`,
            ].join("\n")
          )
          .setFooter({
            text: `**Note:** This is based on the points earned by the monitors.	`,
          })
          .setTimestamp(),
      ],
    });
  },
};
