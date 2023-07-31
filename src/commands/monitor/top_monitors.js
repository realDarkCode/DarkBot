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

    await interaction.deferReply();

    const cls = options.getString("class")?.trim() || "seven";
    const gender = options.getString("gender")?.trim();
    const house = options.getString("house")?.trim();
    const status = options.getString("status")?.trim();
    const monitorListWithPoint = await getMonitorListWithPoints({
      class: cls,
      status,
      gender,
      house,
    });

    const sortedMonitorList = monitorListWithPoint.sort((a, b) => {
      return b.point - a.point;
    });

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Top Monitors`)
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
            text: `Status:${status || "All"} - Class: ${cls || "All"}- Gender:${
              gender || "All"
            } - House:${house || "All"}`,
          })
          .setTimestamp(),
      ],
    });
  },
};
