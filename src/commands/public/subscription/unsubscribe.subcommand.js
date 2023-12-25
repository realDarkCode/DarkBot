const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const optionConfig = require("../../../config/options.config");
const subscriptionService = require("../../../services/subscription.service");
module.exports = {
  subCommand: "subscription.unsubscribe",
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

    if (!searchResult || !searchResult.isActive) {
      embed.setColor("Red");

      embed.setDescription(
        `You are not  subscribed to \`${serviceName}\` service yet`
      );
    } else {
      await subscriptionService.unSubscribe({
        userId: member.id,
        userName: member.displayName,
        serviceName: serviceName,
      });
      embed.setColor("Green");
      embed.setDescription(
        `You have successfully unsubscribed to \`${serviceName}\` service`
      );
    }
    return await interaction.reply({ embeds: [embed] });
  },
};
