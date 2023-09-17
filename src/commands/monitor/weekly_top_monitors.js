const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const disciplineMonitorService = require("../../services/disciplineMonitor.service");
const { capitalizeFirstLetter } = require("../../helpers/convert");

module.exports = {
  subCommand: "monitor.weekly_top_monitors",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    await interaction.deferReply();

    const cls = options.getString("class")?.trim();
    const gender = options.getString("gender")?.trim();

    const weeklyStar =
      await disciplineMonitorService.getDataOfWeeklyActiveMonitors(cls, gender);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Top Weekly Monitors`)
          .setDescription(
            [
              "Top 10 weekly Active Monitors:",
              `${weeklyStar.slice(0, 10).map((monitor, index, arr) => {
                if (arr.length) {
                  return `\n**${index + 1}**. \`${monitor.totalPoint}\` - ${
                    monitor.name
                  } - \`${monitor.school_id}\` - ${
                    monitor.class ? capitalizeFirstLetter(monitor.class) : "N/A"
                  } - ${
                    monitor.section
                      ? capitalizeFirstLetter(monitor.section)
                      : "N/A"
                  }`;
                } else {
                  return `Not enough data found for this class to rank`;
                }
              })}`,
            ].join("\n")
          )
          .setFooter({
            text: `Class: ${cls || "All"}- Gender:${gender || "All"}`,
          })
          .setTimestamp(),
      ],
    });
  },
};
