const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const monitorService = require("../../services/disciplineMonitor.service");
const { capitalizeFirstLetter } = require("../../helpers/convert");

module.exports = {
  subCommand: "monitor.birthday",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const dateType = options.getString("date_type") || "month";
    const monitorList = await monitorService.getCurrentBirthdayMonitors(
      dateType
    );

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Birthday Monitor List`)
      .setDescription(
        monitorList.length === 0
          ? `There is no monitor's  birthday this ${dateType}`
          : monitorList
              .map((monitor, index, arr) => {
                return `**${index + 1}**. _${monitor.name}_ - \`${
                  monitor.school_id
                }\` - \`${capitalizeFirstLetter(monitor.class)}\` - \`${
                  monitor.section
                    ? capitalizeFirstLetter(monitor.section)
                    : "N/A"
                }\` - ${
                  monitor.date_of_birth
                    ? `<t:${Math.round(
                        new Date(monitor.date_of_birth).setFullYear(
                          new Date().getFullYear()
                        ) / 1000
                      )}:R>`
                    : "N/A"
                }`;
              })
              .join("\n")
      );
    return await interaction.reply({ embeds: [embed] });
  },
};
