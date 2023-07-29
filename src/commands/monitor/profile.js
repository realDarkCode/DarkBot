const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { findMonitorById } = require("../../services/disciplineMonitor.service");
const {
  getPoint,
  getMonitorPointHistory,
} = require("../../services/disciplineMonitorPoint.service");
const { capitalizeFirstLetter } = require("../../helpers/convert");
module.exports = {
  subCommand: "monitor.profile",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const id = options.getString("id");
    const monitor = await findMonitorById(id);
    const point = await getPoint(monitor._id);
    const responseEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Monitor Profile");

    if (!monitor) {
      responseEmbed.setDescription("Monitor not found with given school id");
    } else {
      const monitorPointHistory = await getMonitorPointHistory(monitor._id);
      responseEmbed.setDescription(
        [
          `**Point**: ${point}`,
          `**Monitor ID**: ${monitor.school_id}`,
          `**Name**: ${capitalizeFirstLetter(monitor.name)}`,
          `**Status**: ${capitalizeFirstLetter(monitor.status)}`,
          `**Class**: ${capitalizeFirstLetter(monitor.class)} ( ${
            monitor.section || "N/A"
          })`,
          `**Gender:**: ${capitalizeFirstLetter(monitor.gender) || "N/A"}`,
          `**Contact**: ${capitalizeFirstLetter(monitor.contact) || "N/A"}`,
          `**House**: ${capitalizeFirstLetter(monitor.house) || "N/A"}`,
          "",
          "**Recent Point History:**",
          `${
            monitorPointHistory.length
              ? monitorPointHistory
                  .map(
                    (history, index) =>
                      `**${index + 1}.** \`${history.type}\` - \`(${
                        history.point
                      })\` - ${
                        history.reason || "Not specific"
                      } - <t:${Math.round(history.createdAt / 1000)}:R> - <@${
                        history.moderateBy
                      }>`
                  )
                  .join("\n")
              : "No point history found"
          }`,
        ].join("\n")
      );
    }
    return interaction.reply({
      embeds: [responseEmbed],
    });
  },
};
