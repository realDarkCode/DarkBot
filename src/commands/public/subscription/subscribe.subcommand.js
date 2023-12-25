const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const subscriptionService = require("../../../services/subscription.service");
module.exports = {
  subCommand: "subscription.subscribe",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, member } = interaction;
    const serviceName = options.getString("service");
    const embed = new EmbedBuilder().setTitle("Subscription").setColor("Blue");

    const searchResult = await subscriptionService.searchOne({
      userId: member.id,
      serviceName,
    });
    if (searchResult?.isActive) {
      embed.setColor("Red");
      embed.setDescription(
        `You are already subscribed to \`${serviceName}\` service since <t:${Math.round(
          searchResult.updatedAt / 1000
        )}:R>`
      );
    } else {
      const subscription = await subscriptionService.subscribe({
        userId: member.id,
        userName: member.displayName,
        serviceName: serviceName,
      });
      embed.setColor("Green");

      embed.setDescription(
        `You have successfully subscribed to \`${subscription.serviceName}\` service`
      );
    }
    return await interaction.reply({ embeds: [embed] });
  },
};
