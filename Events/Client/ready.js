const { Client } = require("discord.js");
module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  execute(client) {
    console.info(`Bot logged as ${client.user.username}`);
    client.user.setActivity(`Serving ${client.guilds.cache.size} guild(s)`);
  },
};
