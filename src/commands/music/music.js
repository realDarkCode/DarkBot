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
    .addSubcommand((subCommand) =>
      subCommand
        .setName("search")
        .setDescription("Search video/playlist")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("The search term for video/playlist")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Select the video type")
            .addChoices(
              {
                name: "Playlist",
                value: "playlist",
              },
              {
                name: "Video",
                value: "video",
              }
            )
        )
        .addNumberOption((option) =>
          option
            .setName("limit")
            .setDescription("Number of search result")
            .setMinValue(1)
            .setMaxValue(10)
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
        .setName("favorites")
        .setDescription("Show list of the songs that you've played to most")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("play_favorites")
        .setDescription("Play your favorites songs as a playlist")
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
