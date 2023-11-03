const { Client, EmbedBuilder } = require("discord.js");
const { isFirstWeekInMonth } = require("../helpers/date");
const musicCountService = require("../services/music/musicCount.service");
module.exports = {
  name: "favoriteMusic-schedule",
  frequency: "0 23  *  *  5",

  /**
   *  clear the music count database records [Every first Friday of month 00:00].
   * @param {Client} client
   */
  async task(client) {
    try {
      const isFirstWeekOfMonth = isFirstWeekInMonth(new Date());
      if (!isFirstWeekOfMonth) return;

      await musicCountService.dropCollection();
    } catch (error) {
      console.log("Error occurred while executing schedule job:", error);
      return;
    }
  },
};
