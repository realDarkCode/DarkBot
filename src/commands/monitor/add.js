const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { addMonitor } = require("../../services/disciplineMonitor.service");

module.exports = {
  subCommand: "monitor.add",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const id = options.getString("id");
    const name = options.getString("name");
    const cls = options.getString("class");

    const monitor = await addMonitor(id, name, cls);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("Monitor Added Successfully")
          .setDescription(
            [
              `\`School Id\`: ${monitor.school_id}`,
              `\`Name\`: ${monitor.name}`,
              `\`Class\`: ${monitor.class}`,
            ].join("\n")
          )
          .setFooter({
            text: `Monitor Added by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
