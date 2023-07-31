const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
  addBulkPoint,
} = require("../../services/disciplineMonitorPoint.service");
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
    const pointType = options.getString("point_type");
    let reason = options.getString("reason");
    const point = options.getNumber("point");

    if (pointType !== "SPECIAL" && point > 0) {
      return interaction.reply({
        embeds: [
          embed
            .setColor("RED")
            .setTitle("Invalid Point")
            .setDescription("You can only specify point in SPECIAL point type"),
        ],
      });
    }

    if (pointType === "SPECIAL") {
      if (!point || point === 0) {
        return interaction.reply({
          embeds: [
            embed
              .setColor("Red")
              .setTitle("Invalid Point")
              .setDescription("Specify a valid `point` in SPECIAL point type"),
          ],
        });
      } else if (!reason) {
        return interaction.reply({
          embeds: [
            embed
              .setColor("Red")
              .setTitle("Invalid Reason")
              .setDescription("Specify a valid `reason` in SPECIAL point type"),
          ],
        });
      }
    }

    if (pointType !== "SPECIAL") {
      failedIds = await addBulkPoint(
        ids,
        pointType,
        reason,
        interaction.user.id,
        point
      );
    } else {
      if (pointType === POINTS_CONST.ATTENDANCE) {
        reason = "Attended Duty";
      }

      failedIds = await addBulkPoint(
        ids,
        pointType,
        reason,
        interaction.user.id
      );
    }
    return interaction.reply({
      embeds: [
        embed
          .setColor("Green")
          .setTitle("Point Added Successfully")
          .setDescription(
            [
              ids.length === 1
                ? `\`Id\`: ${ids[0]}`
                : `\`Total Requested Ids\`: ${ids.length}`,
              ,
              ids.length > 1 ? `\`Total Failed Ids\`: ${failedIds.length}` : "",
              ids.length > 1 ? `\`Failed Ids\`: ${failedIds.join(", ")}` : "",
              `\`Point Type\`: ${pointType}`,
              `\`Point\`: ${POINTS[pointType]}`,
              `\`Reason\`: ${reason || "N/A"} `,
              `\`Moderated By\`: <@${interaction.user.id}>`,

              ,
            ].join("\n")
          )
          .setTimestamp(),
      ],
    });
  },
};
