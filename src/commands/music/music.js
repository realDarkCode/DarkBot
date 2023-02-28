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
      subcommand.setName("pause").setDescription("pause the queue")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("resume").setDescription("resume the queue")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("skip").setDescription("skip the queue")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stop").setDescription("stop the queue")
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
        .setName("options")
        .setDescription("select a option")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("select a option")
            .setRequired(true)
            .addChoices(
              { name: "🔢 View Queue", value: "queue" },
              { name: "🔀 Shuffle Queue", value: "shuffle" },
              { name: "🔄 Toggle Auto Play Modes", value: "autoPlay" },
              { name: "🈁 Add Related Songs", value: "relatedSong" },
              { name: "🔁 Toggle Repeat Songs", value: "repeatMode" }
            )
        )
    ),
};
