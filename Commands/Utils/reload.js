const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const { loadCommands, loadEvents } = require("../../Handlers/index");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload Bot commands/events")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((option) =>
      option.setName("commands").setDescription("Reload you commands.")
    )
    .addSubcommand((option) =>
      option.setName("events").setDescription("Reload your events.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const client = interaction.client;
    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case "events":
        {
        }
        loadEvents(client);
        interaction.reply({ content: "Reloaded the Events" });
        break;
      case "commands": {
        loadCommands(client);
        interaction.reply({ content: "Reloaded the Commands" });
      }
    }
  },
};
