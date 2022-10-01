const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { loadCommands, loadEvents } = require("../../handlers");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload Commands/Events")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((option) =>
      option.setName("events").setDescription("Reload all events")
    )
    .addSubcommand((option) =>
      option.setName("commands").setDescription("Reload all commands")
    ),
  developerOnly: true,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    const client = interaction.client;
    switch (subCommand) {
      case "events":
        {
          for (const [key, value] of client.events)
            client.removeListener(key, value, true);
          await loadEvents(client);
          interaction.reply({ content: "Events reloaded", ephemeral: true });
          return;
        }
        break;
      case "commands":
        {
          await loadCommands(client);
          interaction.reply({ content: "Commands reloaded", ephemeral: true });
          return;
        }
        break;
    }
  },
};
