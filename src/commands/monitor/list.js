const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
  getMonitorListWithPoints,
} = require("../../services/disciplineMonitor.service");

module.exports = {
  subCommand: "monitor.list",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const cls = "seven";
    const monitorList = await getMonitorListWithPoints({ class: cls });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Monitor List from class ${cls}`)
          .setDescription(
            monitorList.length === 0
              ? "No monitor list found"
              : `${monitorList.splice(0, 30).map((monitor, index, arr) => {
                  return `\n**${index + 1}**. _${monitor.name}_ - \`${
                    monitor.school_id
                  }\` - \`(${monitor.point})\``;
                })}`
          )
          .setFooter({
            text: `**Note:** This is based on the points earned by the monitors.	`,
          }),
      ],
    });
  },
};
