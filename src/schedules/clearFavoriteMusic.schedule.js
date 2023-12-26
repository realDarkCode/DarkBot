const { Client, EmbedBuilder } = require("discord.js");
const musicCountService = require("../services/music/musicCount.service");
module.exports = {
  name: "clearFavoriteMusic",
  frequency: "59 23  *  *  6",

  /**
   *  clear the music count database records [Every first Saturday after day 1 of month 00:00].
   * @param {Client} client
   */
  async task(client) {
    try {
      const dateInMonth = new Date().getDate();
      const hasTimePassedForStatsToSend = dateInMonth > 1 && dateInMonth <= 8;
      if (!hasTimePassedForStatsToSend) return;

      await musicCountService.dropCollection();
    } catch (error) {
      console.log("Error occurred while executing schedule job:", error);
      return;
    }
  },
};
