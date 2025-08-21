const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "music.queue",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild } = interaction;

    // Get the queue
    const queue = client.player.nodes.get(guild.id);
    if (!queue || (!queue.tracks.data.length && !queue.currentTrack)) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ The queue is empty!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.data.slice(0, 10); // Show first 10 tracks

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: "Music Queue",
        iconURL: guild.iconURL(),
      })
      .setTimestamp();

    if (currentTrack) {
      embed.addFields({
        name: "🎵 Now Playing",
        value:
          `**[${currentTrack.title}](${currentTrack.url})**\n` +
          `Duration: ${currentTrack.duration} | Requested by: ${
            queue.metadata.requestedBy?.tag ||
            currentTrack.requestedBy?.tag ||
            "Unknown"
          }`,
        inline: false,
      });
    }

    if (tracks.length > 0) {
      const queueDescription = tracks
        .map((track, index) => {
          return (
            `**${index + 1}.** [${track.title}](${track.url})\n` +
            `Duration: ${track.duration} | Requested by: ${
              track.requestedBy?.tag || "Unknown"
            }`
          );
        })
        .join("\n\n");

      embed.addFields({
        name: "📄 Up Next",
        value:
          queueDescription.length > 1024
            ? queueDescription.substring(0, 1021) + "..."
            : queueDescription,
        inline: false,
      });

      if (queue.tracks.data.length > 10) {
        embed.setFooter({
          text: `And ${queue.tracks.data.length - 10} more tracks...`,
        });
      }
    }

    // Add queue stats
    embed.addFields({
      name: "📊 Queue Stats",
      value:
        `Total tracks: ${queue.tracks.data.length + (currentTrack ? 1 : 0)}\n` +
        `Queue duration: ${queue.estimatedDuration || "Unknown"}\n` +
        `Loop mode: ${
          queue.repeatMode === 0
            ? "Off"
            : queue.repeatMode === 1
            ? "Track"
            : "Queue"
        }`,
      inline: true,
    });

    return interaction.reply({ embeds: [embed] });
  },
};
