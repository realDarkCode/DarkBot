const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
  updateMonitorInfo,
} = require("../../services/disciplineMonitor.service");
const { capitalizeFirstLetter } = require("../../helpers/convert");
module.exports = {
  subCommand: "monitor.update_info",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const id = options.getString("id")?.trim();
    const name = options.getString("name")?.trim();
    const cls = options.getString("class")?.trim();
    const status = options.getString("status")?.trim();
    const section = options.getString("section")?.trim();
    const gender = options.getString("gender")?.trim();
    const contact = options.getString("contact")?.trim();
    const house = options.getString("house")?.trim();
    const dateOfBirth = options.getString("date_of_birth")?.trim();
    const bloodGroup = options.getString("blood_group")?.trim();

    const updatedMonitor = await updateMonitorInfo(id, {
      contact,
      section,
      house,
      bloodGroup,
      dateOfBirth,
      cls,
      gender,
      status,
      name,
    });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("Monitor Information Updated Successfully")
          .setDescription(
            [
              `**Monitor ID**: ${updatedMonitor.school_id}`,
              `**Name**: ${capitalizeFirstLetter(updatedMonitor.name)}`,
              `**Status**: ${capitalizeFirstLetter(updatedMonitor.status)}`,
              `**Class**: ${capitalizeFirstLetter(updatedMonitor.class)} ( ${
                updatedMonitor.section
                  ? capitalizeFirstLetter(updatedMonitor.section)
                  : "N/A"
              })`,
              `**Gender:**: ${
                updatedMonitor.gender
                  ? capitalizeFirstLetter(updatedMonitor.gender)
                  : "N/A"
              }`,
              `**Contact**: ${
                updatedMonitor.contact
                  ? capitalizeFirstLetter(updatedMonitor.contact)
                  : "N/A"
              }`,
              `**House**: ${
                updatedMonitor.house
                  ? capitalizeFirstLetter(updatedMonitor.house)
                  : "N/A"
              }`,
              `**Date of Birth**: ${
                updatedMonitor.date_of_birth
                  ? updatedMonitor.date_of_birth
                  : "N/A"
              }`,
              `**Blood Group**: ${
                updatedMonitor.blood_group
                  ? updatedMonitor.blood_group.toUpperCase()
                  : "N/A"
              }`,
              "",
            ].join("\n")
          ),
      ],
    });
  },
};
