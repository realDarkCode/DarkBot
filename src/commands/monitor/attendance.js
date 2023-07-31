const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
  addBulkAttendancePoint,
} = require("../../services/disciplineMonitorPoint.service");

module.exports = {
  subCommand: "monitor.attendance",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    await interaction.deferReply();

    const optionId = options.getString("ids");
    const ids = optionId.replace(/ /g, "").split(",");
    const failedAttendanceIds = await addBulkAttendancePoint(
      ids,
      interaction.user.id
    );

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Yellow")
          .setTitle("Attendance Added Successfully")
          .setDescription(
            [
              `**Total Attendance**: \`${ids.length}\``,
              `**Ids**: ${ids.length ? ids.join(", ") : "`N/A`"}`,
              "",
              `**Failed Attendance**: \`${failedAttendanceIds.length}\``,
              `**Failed Ids**: ${
                failedAttendanceIds.length
                  ? failedAttendanceIds.join(", ")
                  : "`N/A`"
              }`,
            ].join("\n")
          ),
      ],
    });
  },
};
