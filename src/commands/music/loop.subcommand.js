const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "music.loop",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, member, guild } = interaction;
    const mode = interaction.options.getString("mode");

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
      let newMode;
      let modeText;
      let modeEmoji;

      if (!mode) {
        // Cycle through modes: Off -> Track -> Queue -> Off
        const currentMode = queue.repeatMode;
        if (currentMode === 0) {
          newMode = 1; // Track
          modeText = "Track";
          modeEmoji = "🔂";
        } else if (currentMode === 1) {
          newMode = 2; // Queue
          modeText = "Queue";
          modeEmoji = "🔁";
        } else {
          newMode = 0; // Off
          modeText = "Off";
          modeEmoji = "▶️";
        }
      } else {
        // Set specific mode
        switch (mode) {
          case "off":
            newMode = 0;
            modeText = "Off";
            modeEmoji = "▶️";
            break;
          case "track":
            newMode = 1;
            modeText = "Track";
            modeEmoji = "🔂";
            break;
          case "queue":
            newMode = 2;
            modeText = "Queue";
            modeEmoji = "🔁";
            break;
        }
      }

      queue.setRepeatMode(newMode);

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `${modeEmoji} Loop mode has been set to **${modeText}**`
        )
        .setFooter({ text: `Changed by ${member.user.tag}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Loop command error:", error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "❌ An error occurred while trying to change the loop mode!"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
