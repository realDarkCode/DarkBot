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

    const optionId = options.getString("ids");

    const ids = optionId.split(", ");

    const failedAttendanceIds = await addBulkAttendancePoint(
      ids,
      interaction.user.id
    );

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Greyple")
          .setTitle("Attendance Added Successfully")
          .setDescription(
            [
              `**Total Attendance**: \`${ids.length}\``,
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
