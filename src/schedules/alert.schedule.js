const { Client, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../schemas/alert.schema.js");
module.exports = {
  name: "alert",
  frequency: "0 */5 * * * *",
  /**
   *
   * @param {Client} client
   */
  async task(client) {
    try {
      const now = new Date();
      const utcTime = now.toISOString().slice(11, 16); // Get "HH:MM" format

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const today = days[now.getUTCDay()];

      const messages = await AlertMessage.find({
        schedule: { $elemMatch: { day: today, time: utcTime } },
      });

      for (const msg of messages) {
        // Ensure it's not sent in the last 5 minutes
        if (
          msg.lastSend &&
          msg.lastSend > new Date(Date.now() - 5 * 60 * 1000)
        ) {
          continue; // Skip this message
        }

        const channel = await client.channels.fetch(msg.channelId);
        if (channel) {
          await channel.send(msg.message);

          // Update `lastSend` globally
          await AlertMessage.updateOne(
            { _id: msg._id },
            { lastSend: new Date() }
          );
        }
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
