const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

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
};
