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
    await interaction.deferReply();
    const responseEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Monitor Profile");

    const id = options.getString("id")?.trim();
    const cls = options.getString("class");

    if (id.length !== 3 && id.length !== 9) {
      responseEmbed.setDescription(
        "Invalid school id. ID must be 3 or 9 digit long"
      );
      return interaction.editReply({
        embeds: [responseEmbed],
      });
    }
    const monitor = await findMonitorById(id, cls);

    if (!monitor) {
      responseEmbed.setDescription(
        "Monitor not found with given school id: " + id
      );
    } else {
      const point = await getPoint(monitor._id);
      const monitorPointHistory = await getMonitorPointHistory(monitor._id);
      responseEmbed.setDescription(
        [
          `**Point**: ${point}`,
          `**Monitor ID**: ${monitor.school_id}`,
          `**Name**: ${capitalizeFirstLetter(monitor.name)}`,
          `**Status**: ${capitalizeFirstLetter(monitor.status)}`,
          `**Class**: ${capitalizeFirstLetter(monitor.class)} (${
            monitor.section ? capitalizeFirstLetter(monitor.section) : "N/A"
          })`,
          `**Gender:**: ${
            monitor.gender ? capitalizeFirstLetter(monitor.gender) : "N/A"
          }`,
          `**Contact**: ${
            monitor.contact ? capitalizeFirstLetter(monitor.contact) : "N/A"
          }`,
          `**House**: ${
            monitor.house ? capitalizeFirstLetter(monitor.house) : "N/A"
          }`,
          `**Date of Birth**: ${
            monitor.date_of_birth ? monitor.date_of_birth : "N/A"
          }`,
          `**Blood Group**: ${
            monitor.blood_group ? monitor.blood_group.toUpperCase() : "N/A"
          }`,
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
              : "No point history found to show"
          }`,
        ].join("\n")
      );
    }
    return interaction.editReply({
      embeds: [responseEmbed],
    });
  },
};
