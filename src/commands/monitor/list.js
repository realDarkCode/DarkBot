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

    await interaction.deferReply();
    const cls = options.getString("class") || "seven";
    const gender = options.getString("gender");
    const house = options.getString("house");
    const status = options.getString("status");
    const section = options.getString("section");
    const monitorList = await getMonitorListWithPoints({
      class: cls,
      gender,
      house,
      status,
      section,
    });

    const _len = monitorList.length;
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Monitor List`)
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
            text: `Total: ${_len}-status:${status || "All"}-class: ${
              cls || "All"
            }-gender:${gender || "All"}-house:${house || "All"}-section:${
              section || "All"
            }`,
          }),
      ],
    });
  },
};
