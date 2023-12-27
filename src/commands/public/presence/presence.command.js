const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("presence")
    .setDescription("see the presence of a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("individual")
        .setDescription("See a particular user last presence status")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Target user")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("guild")
        .setDescription("See the members presence status of this guild")
    ),
};
