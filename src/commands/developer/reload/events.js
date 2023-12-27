const { ChatInputCommandInteraction } = require("discord.js");
const { loadEvents } = require("../../../handlers");

module.exports = {
  subCommand: "reload.events",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const client = interaction.client;

    for (const [key, value] of client.events)
      client.removeListener(key, value, true);
    const eventList = await loadEvents(client);

    interaction.reply({
      content: `loaded ${eventList.length} events`,
      ephemeral: true,
    });
  },
};
