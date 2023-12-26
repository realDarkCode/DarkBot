const { Client, EmbedBuilder } = require("discord.js");
const botConfig = require("../config/bot");
module.exports = {
  name: "botCharge",
  frequency: "0 18 * * *",
  /**
   * Notify Developer to claim coin for server to keep running.
   * @param {Client} client
   */
  async task(client) {
    try {
      const developer = await client.users.fetch(
        botConfig.development?.developerID
      );
      if (!developer) return;

      const responseEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Recharge Bot Battery")
        .setDescription(
          `Claim todays coin at: https://bot-hosting.net/panel/earn`
        );

      await developer.send({ embeds: [responseEmbed] });
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
