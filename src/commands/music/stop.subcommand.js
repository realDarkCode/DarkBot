const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "music.stop",
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
    if (!queue) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ No music is currently playing!");
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
      queue.delete();

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          "⏹️ Music has been stopped and the queue has been cleared"
        )
        .setFooter({ text: `Stopped by ${member.user.tag}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Stop command error:", error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ An error occurred while trying to stop the music!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
