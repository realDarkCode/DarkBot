const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Music player commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription(
          "Play a track/playlist from YouTube, Spotify, or SoundCloud"
        )
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("URL or search query")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for tracks and choose which one to play")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Search query for tracks")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pause")
        .setDescription("Pause or resume the current track")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("skip").setDescription("Skip the current track")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stop")
        .setDescription("Stop the music and clear the queue")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("loop")
        .setDescription("Toggle loop mode for the current track or queue")
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription("Loop mode to set")
            .setRequired(false)
            .addChoices(
              { name: "Off", value: "off" },
              { name: "Track", value: "track" },
              { name: "Queue", value: "queue" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("nowplaying")
        .setDescription("Show information about the currently playing track")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("queue")
        .setDescription("Display the current music queue")
    ),
};
