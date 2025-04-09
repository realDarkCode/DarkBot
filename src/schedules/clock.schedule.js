const { Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "clock",
  frequency: "0 * * * * *",

  /**
   *  UTC Clock
   * @param {Client} client
   */
  async task(client) {
    try {
      // fetch all the channels where the clock is enabled
      const channels = client.guildConfig.reduce((acc, config) => {
        if (config.clockChannelId) {
          acc.push(config.clockChannelId);
        }
        return acc;
      }, []);

      if (!channels.length) return;

      channels.map(async (channelId) => {
        // Fetch the channel to send the clock message
        const channel = client.channels.cache.get(channelId);
        if (!channel) return;

        const messages = await channel.messages.fetch({ limit: 1 });
        const lastMessage = messages.first();

        let clockMessage;
        // Check if the last message was sent by the bot in that channel to edit that
        if (lastMessage && lastMessage.author.id === client.user.id) {
          clockMessage = lastMessage;
        }

        const now = new Date();
        const formattedTime = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "UTC",
        }).format(now);

        const embed = new EmbedBuilder()
          .setTitle("Game Time")
          .setDescription(formattedTime)
          .setFooter({ text: "Updates every minute" })
          .setTimestamp();

        if (clockMessage) {
          // Edit the existing message
          await clockMessage.edit({ embeds: [embed] });
        } else {
          // Send a new message
          await channel.send({ embeds: [embed] });
        }
      });
    } catch (error) {
      console.log("Error occurred while executing schedule job:", error);
      return;
    }
  },
};
