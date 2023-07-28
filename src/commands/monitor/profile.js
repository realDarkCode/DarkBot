const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { findMonitorById } = require("../../services/disciplineMonitor.service");

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

    const responseEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Monitor Profile");

    if (!monitor) {
      responseEmbed.setDescription("Monitor not found with given school id");
    } else {
      responseEmbed.setDescription(
        [
          `**Monitor ID**: ${monitor.school_id}`,
          `**Name**: ${monitor.name}`,
          `**Status**: ${monitor.status}`,
          `**Class**: ${monitor.class} ( ${monitor.section || "N/A"})`,
          `**Gender:**: ${monitor.gender || "N/A"}`,
          `**Contact**: ${monitor.contact || "N/A"}`,
          `**House**: ${monitor.house || "N/A"}`,
        ].join("\n")
      );
    }
    return interaction.reply({
      embeds: [responseEmbed],
    });
  },
};
