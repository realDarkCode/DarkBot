const { EmbedBuilder } = require("discord.js");

/**
 * Music System - Handles all discord-player events
 * @param {import("discord.js").Client} client
 */
module.exports = (client) => {
  const player = client.player;

  // Prevent duplicate event listeners
  if (player._musicSystemLoaded) {
    console.log("🎵 Music system already loaded, skipping...");
    return;
  }
  player._musicSystemLoaded = true;

  // Player starts playing a track
  player.events.on("playerStart", (queue, track) => {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: "Now Playing",
        iconURL: client.user.avatarURL(),
      })
      .setDescription(`🎵 **[${track.title}](${track.url})**`)
      .addFields(
        {
          name: "Duration",
          value: track.duration,
          inline: true,
        },
        {
          name: "Author",
          value: track.author,
          inline: true,
        },
        {
          name: "Requested by",
          value:
            queue.metadata.requestedBy?.tag ||
            track.requestedBy?.tag ||
            "Unknown",
          inline: true,
        }
      )
      .setThumbnail(track.thumbnail)
      .setTimestamp();

    queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Queue becomes empty
  player.events.on("emptyQueue", (queue) => {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription("⏹️ Queue is empty! Leaving the voice channel...")
      .setTimestamp();

    queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Audio track error
  player.events.on("audioTrackError", (queue, track, error) => {
    console.error(`❌ Audio track error for ${track.title}:`, error.message);
  });

  // Player error occurred
  player.events.on("playerError", (queue, error) => {
    console.error(
      `❌ Music player error in guild ${queue.guild.name}:`,
      error.message
    );

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("❌ An error occurred with the music player!")
      .setTimestamp();

    queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Bot disconnected from voice channel
  player.events.on("disconnect", (queue) => {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription("👋 Disconnected from the voice channel!")
      .setTimestamp();

    queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
  });

  // Debug events (optional, only in development)
  if (process.env.NODE_ENV === "development") {
    player.events.on("debug", (message) => {
      console.log(`🎵 Player Debug: ${message}`);
    });
  }
};
