const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "music.play",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, member, guild, channel } = interaction;
    const query = interaction.options.getString("query", true);

    // Check if user is in a voice channel
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ You need to be in a voice channel to play music!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check bot permissions
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has(["Connect", "Speak"])) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "❌ I need Connect and Speak permissions in your voice channel!"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const { track, searchResult } = await client.player.play(
        voiceChannel,
        query,
        {
          nodeOptions: {
            metadata: {
              channel: channel,
              client: client,
              requestedBy: member.user,
              guild: guild, // Add guild for multi-server compatibility
            },
            leaveOnEnd: false, // Don't leave immediately when song ends
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 60000, // 1 minute instead of 5
            selfDeaf: true,
            volume: 80, // Set default volume
            // Ensure the player doesn't stop immediately
            bufferingTimeout: 3000,
          },
          requestedBy: member.user, // Also set it here for the track
          searchEngine: "youtube", // Primary search engine
          fallbackSearchEngine: "soundcloud",
        }
      );

      // Just send a simple acknowledgment, the "Now Playing" will be sent by the music system
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `✅ **[${track.title}](${track.url})** has been added to the queue`
        )
        .setFooter({ text: `Requested by ${member.user.tag}` })
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error("Play command error:", error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `❌ An error occurred while trying to play the track:\n\`${error.message}\``
        );
      return interaction.followUp({ embeds: [embed] });
    }
  },
};
