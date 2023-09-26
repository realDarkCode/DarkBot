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

    const _query = {};
    if (cls) _query.class = cls;
    if (gender) _query.gender = gender;

    const weeklyStar =
      await disciplineMonitorService.getDataOfWeeklyActiveMonitors({
        query: _query,
        limit: 6,
      });
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Top Weekly Monitors`)
          .setDescription(
            [
              "**Top 10 weekly Active Monitors:**",
              `${
                weeklyStar.activeList.length === 0
                  ? `Not enough data found for this query`
                  : weeklyStar.activeList
                      .map((monitor, index) => {
                        return `**${index + 1}**. \`${monitor.totalPoint}\` - ${
                          monitor.name
                        } - \`${monitor.school_id}\` - ${
                          monitor.class
                            ? capitalizeFirstLetter(monitor.class)
                            : "N/A"
                        } - ${
                          monitor.section
                            ? capitalizeFirstLetter(monitor.section)
                            : "N/A"
                        }`;
                      })
                      .join("\n")
              }`,

              "\n\n**Top 10 weekly Inactive Monitors:**",
              `${
                weeklyStar.inactiveList.length === 0
                  ? `Not enough data found for this query`
                  : weeklyStar.inactiveList
                      .map((monitor, index) => {
                        return `**${index + 1}**. \`${monitor.totalPoint}\` - ${
                          monitor.name
                        } - \`${monitor.school_id}\` - ${
                          monitor.class
                            ? capitalizeFirstLetter(monitor.class)
                            : "N/A"
                        } - ${
                          monitor.section
                            ? capitalizeFirstLetter(monitor.section)
                            : "N/A"
                        }`;
                      })
                      .join("\n")
              }`,
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
