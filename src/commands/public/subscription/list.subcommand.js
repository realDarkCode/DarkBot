const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const optionConfig = require("../../../config/options.config");
const subscriptionService = require("../../../services/subscription.service");

module.exports = {
  subCommand: "subscription.list",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const list = optionConfig.serviceList;

    const responseEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Subscription list");

    if (!list.length) {
      responseEmbed.setColor("Yellow");
      responseEmbed.setDescription(
        "There is no service available in this server"
      );
    } else {
      responseEmbed.setDescription(
        [
          "`S/N`. `Service_Name` - `Short_Description`",
          ...list.map(
            (service, index) =>
              `**${index + 1}.** \`${service.name}\` - ${
                service.shortDescription || "No Description added"
              }`
          ),
        ].join("\n")
      );
    }
    await interaction.reply({ embeds: [responseEmbed] });
  },
};
