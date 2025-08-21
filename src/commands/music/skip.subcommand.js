const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "music.skip",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, member, guild } = interaction;

    // Check if user is in a voice channel
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "❌ You need to be in a voice channel to use this command!"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Get the queue
    const queue = client.player.nodes.get(guild.id);
    if (!queue || !queue.isPlaying()) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ Nothing is currently playing!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check if user is in the same voice channel as the bot
    const botVoiceChannel = guild.members.me.voice.channel;
    if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ You need to be in the same voice channel as me!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const currentTrack = queue.currentTrack;
      queue.node.skip();
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `⏭️ **[${currentTrack.title}](${currentTrack.url})** has been skipped`
        )
        .setFooter({ text: `Skipped by ${member.user.tag}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Skip command error:", error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ An error occurred while trying to skip the track!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
