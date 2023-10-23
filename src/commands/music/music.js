const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Control the music player")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("play a song")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Enter the song name or link")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("volume")
        .setDescription("set volume")
        .addNumberOption((option) =>
          option
            .setName("volume")
            .setDescription("set volume")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(100)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("top_music")
        .setDescription("Top music requested by you")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("skip")
        .setDescription("Skip music to specific position in queue")
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("How many songs you want to skip")
            .setMinValue(1)
            .setRequired(true)
        )
    ),
};
