const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const subscriptionService = require("../../../services/subscription.service");
module.exports = {
  subCommand: "subscription.my_services",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, member } = interaction;
    const embed = new EmbedBuilder()
      .setTitle("Your services list")
      .setColor("Blue");

    const subscriptionList = await subscriptionService.getUserSubscriptionList(
      member.id
    );

    if (!subscriptionList.length) {
      embed.setColor("Yellow");
      embed.setDescription(`You haven't Subscribed to any service yet.`);
    } else {
      embed.setColor("Green");
      embed.setDescription(
        [
          "`S/N`. `Name` - `Active` - `Subscribed_Since`",
          ...subscriptionList.map(
            (s, i) =>
              `${i + 1}. \`${s.serviceName}\` - **${
                s.isActive ? "Yes" : "No"
              }** - <t:${Math.round(s.createdAt / 1000)}:R>`
          ),
        ].join("\n")
      );
    }
    return await interaction.reply({ embeds: [embed] });
  },
};
