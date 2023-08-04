const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const monitorPointService = require("../../services/disciplineMonitorPoint.service.js");

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
    const cls = options.getString("class")?.trim();

    const isAllValid3Digit = ids.every((id) => id.length === 3 && !isNaN(id));
    const isAllValid9Digit = ids.every((id) => id.length === 9 && !isNaN(id));

    if (!isAllValid3Digit && !isAllValid9Digit) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Monitor Attendance Failed")
            .setDescription(
              "Please Enter valid student ids [all should be 3 or 9 digit]"
            ),
        ],
      });
    }

    if (ids[0].length === 3 && !cls) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Monitor Attendance Failed")
            .setDescription(
              "You must specify class if you want to use 3 digit ids."
            ),
        ],
      });
    }
    const failedAttendanceIds =
      await monitorPointService.addBulkAttendancePoints(
        ids,
        interaction.user.id,
        cls
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
