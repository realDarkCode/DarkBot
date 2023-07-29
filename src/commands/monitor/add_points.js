const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
  addPoint,
  addSpecialPoint,
} = require("../../services/disciplineMonitorPoint.service");

module.exports = {
  subCommand: "monitor.add_points",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const embed = new EmbedBuilder();

    const id = options.getString("id");
    const pointType = options.getString("point_type");
    const reason = options.getString("reason");
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
    let POINT;

    if (pointType !== "SPECIAL") {
      POINT = await addPoint(id, pointType, reason, interaction.user.id);
    } else {
      POINT = await addSpecialPoint(id, point, reason, interaction.user.id);
    }
    return interaction.reply({
      embeds: [
        embed
          .setColor("Green")
          .setTitle("Point Added Successfully")
          .setDescription(
            [
              `\`School Id\`: ${id}`,
              `\`Point Type\`: ${POINT.type}`,
              `\`Point\`: ${POINT.point}`,
              `\`Reason\`: ${POINT.reason || "N/A"} `,
              `\`Moderated By\`: <@${interaction.user.id}>`,
            ].join("\n")
          )
          .setTimestamp(),
      ],
    });
  },
};
