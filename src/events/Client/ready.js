const {
  loadCommands,
  loadComponents,
  loadSystems,
  loadSchedules,
} = require("../../handlers");
const { Client, ActivityType } = require("discord.js");
const { updateRuntimeStatus } = require("../../services/botPresence.discord");

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  execute(client) {
    console.log(`Client logged in as ${client.user.tag}`);

    updateRuntimeStatus(client);

    loadCommands(client);
    loadComponents(client);
    loadSystems(client);
    loadSchedules(client);
  },
};
