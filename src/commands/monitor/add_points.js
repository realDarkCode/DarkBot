const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const monitorPointService = require("../../services/disciplineMonitorPoint.service");
const { POINTS, POINTS_CONST } = require("../../config/NDT.config");
module.exports = {
  subCommand: "monitor.add_points",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const embed = new EmbedBuilder();

    const ids = options.getString("ids").replace(/ /g, "").split(",");
    const cls = options.getString("class")?.trim();

    const pointType = options.getString("point_type");
    let reason = options.getString("reason");
    const point = options.getNumber("point");

    const isAllValid3Digit = ids.every((id) => id.length === 3 && !isNaN(id));
    const isAllValid9Digit = ids.every((id) => id.length === 9 && !isNaN(id));

    if (!isAllValid3Digit && !isAllValid9Digit) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Monitor bulk Point Failed")
            .setDescription(
              "Please Enter valid student ids [all should be 3 or 9 digit]"
            ),
        ],
      });
    }
    if (isAllValid3Digit && !cls) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()

            .setColor("Red")
            .setTitle("Monitor bulk Point Failed")
            .setDescription(
              "You must specify `class` if you want to use 3 digit ids."
            ),
        ],
        ephemeral: true,
      });
    }

    if (pointType !== "SPECIAL" && point) {
      return interaction.reply({
        embeds: [
          embed
            .setColor("Red")
            .setTitle("Invalid Point")
            .setDescription(
              "You can only specify **points** in `SPECIAL` point type"
            ),
        ],
        ephemeral: true,
      });
    }

    if (pointType === "SPECIAL") {
      if (!point || point === 0) {
        return interaction.reply({
          embeds: [
            embed
              .setColor("Red")
              .setTitle("Invalid Point")
              .setDescription(
                "Specify a valid **point** in `SPECIAL` point type"
              ),
          ],
          ephemeral: true,
        });
      } else if (!reason) {
        return interaction.reply({
          embeds: [
            embed
              .setColor("Red")
              .setTitle("Invalid Reason")
              .setDescription(
                "Specify a valid **reason** in `SPECIAL` point type"
              ),
          ],
          ephemeral: true,
        });
      }
    }

    await interaction.deferReply();

    if (pointType !== "SPECIAL") {
      if (pointType === POINTS_CONST.ATTENDANCE) {
        reason = "Attended Duty";
      }
      failedIds = await monitorPointService.addBulkPoints({
        schoolIds: ids,
        cls,
        pointType,
        reason,
        moderateBy: interaction.user.id,
      });
    } else {
      failedIds = await monitorPointService.addBulkPoints({
        schoolIds: ids,
        cls,
        pointType: "SPECIAL",
        point,
        reason,
        moderateBy: interaction.user.id,
      });
    }
    return interaction.editReply({
      embeds: [
        embed
          .setColor("Green")
          .setTitle("Point Added Successfully")
          .setDescription(
            [
              ids.length === 1
                ? `\`Id\`: ${ids[0]}`
                : `\`Total Requested Ids\`: ${ids.length}`,
              `\`Requested Ids\`: ${ids.join(", ")}`,
              ids.length > 1 ? `\`Total Failed Ids\`: ${failedIds.length}` : "",
              ids.length > 1
                ? `\`Failed Ids\`: ${failedIds.join(", ") || "N/A"}`
                : "",
              "",
              `\`Point Type\`: ${pointType}`,
              `\`Point\`: ${POINTS[pointType] || point}`,
              `\`Reason\`: ${reason || "N/A"} `,
              "",
              `\`Moderated By\`: <@${interaction.user.id}>`,

              ,
            ].join("\n")
          )
          .setTimestamp(),
      ],
    });
  },
};
