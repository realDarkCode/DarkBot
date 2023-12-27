const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developerOnly: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload Commands/Events")
    .addSubcommand((option) =>
      option.setName("events").setDescription("Reload all events")
    )
    .addSubcommand((option) =>
      option.setName("commands").setDescription("Reload all commands")
    )
    .addSubcommand((option) =>
      option.setName("components").setDescription("Reload all components")
    ),
  developerOnly: true,
};
