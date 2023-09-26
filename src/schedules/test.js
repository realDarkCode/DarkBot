const { Client } = require("discord.js");

module.exports = {
  name: "test-schedule",
  frequency: "*/15 * * * * *",
  /**
   *
   * @param {Client} client
   */
  async task(client) {
    const currentTime = new Date();

    console.log(`[${currentTime.toLocaleString()}]  Schedule sended`);
  },
};
