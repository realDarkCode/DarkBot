const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "music.nowplaying",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild } = interaction;

    // Get the queue
    const queue = client.player.nodes.get(guild.id);
    if (!queue || !queue.currentTrack) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ Nothing is currently playing!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const track = queue.currentTrack;
    const progress = queue.node.createProgressBar();
    const isPaused = queue.node.isPaused();

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: isPaused ? "Currently Paused" : "Now Playing",
        iconURL: guild.iconURL(),
      })
      .setTitle(track.title)
      .setURL(track.url)
      .setDescription(
        `**Author:** ${track.author}\n**Duration:** ${track.duration}`
      )
      .addFields(
        {
          name: "Progress",
          value: progress || "Unknown",
          inline: false,
        },
        {
          name: "Requested by",
          value:
            queue.metadata.requestedBy?.tag ||
            track.requestedBy?.tag ||
            "Unknown",
          inline: true,
        },
        {
          name: "Queue Length",
          value: `${queue.tracks.data.length} tracks`,
          inline: true,
        },
        {
          name: "Volume",
          value: `${queue.node.volume}%`,
          inline: true,
        },
        {
          name: "Loop Mode",
          value:
            queue.repeatMode === 0
              ? "Off"
              : queue.repeatMode === 1
              ? "Track"
              : "Queue",
          inline: true,
        },
        {
          name: "Status",
          value: isPaused ? "⏸️ Paused" : "▶️ Playing",
          inline: true,
        }
      )
      .setThumbnail(track.thumbnail)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
