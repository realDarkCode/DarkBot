const { Client } = require("discord.js");
module.exports = {
  name: "ready",
  rest: false,
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.info(`Bot logged as ${client.user.username}`);
    client.user.setActivity(`Serving ${client.guilds.cache.size} guild(s)`);
  },
};
