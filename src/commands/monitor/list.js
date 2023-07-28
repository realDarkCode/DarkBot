const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { getMonitorList } = require("../../services/disciplineMonitor.service");

module.exports = {
  subCommand: "monitor.list",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const monitorList = await getMonitorList({ class: "seven" });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("Monitor Added Successfully")
          .setDescription(
            `${monitorList.map((monitor, index) => {
              if (index < 30) {
                return `\n**${index + 1}**. ${monitor.name} - \`${
                  monitor.school_id
                } - ${monitor.class}\``;
              } else {
                return `list is too large to render`;
              }
            })}`
          )
          .setFooter({
            text: `Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
