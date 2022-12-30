const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup Events/System")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((option) =>
      option
        .setName("member_log")
        .setDescription("Log member account status on join or leave")
        .addChannelOption((option) =>
          option
            .setName("log_channel")
            .setDescription("select logging channel for this system")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption((option) =>
          option
            .setName("member_role")
            .setDescription("select member role that will added to new  member")
        )
        .addRoleOption((option) =>
          option
            .setName("bot_role")
            .setDescription("select bot role that will added to new bot")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("bot")
        .setDescription("Config bot settings for this guild")
        .addChannelOption((option) =>
          option
            .setName("log_channel")
            .setDescription("set  bot default logging channel")
            .addChannelTypes(ChannelType.GuildText)
        )
    ),
};
