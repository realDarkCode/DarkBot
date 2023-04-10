const { ButtonInteraction } = require("discord.js");
const { isValidMusicInteraction } = require("../../helpers/music.helper");
module.exports = {
  data: {
    name: "music",
  },
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { buttonInfo, guild, client } = interaction;
    const isValid = await isValidMusicInteraction(interaction);
    if (!isValid) return;
    const queue = await client.distube.getQueue(guild);
    switch (buttonInfo[0]) {
      case "skip": {
        if (!queue.songs.length > 1) {
          return await interaction.reply({
            content: "⏩ There is no song to skip.",
            ephemeral: true,
          });
        }
        client.distube.skip(guild);
        return await interaction.reply({
          content: "⏩ Song has been skipped.",
        });
      }
      case "pause": {
        if (queue.paused)
          return await interaction.reply({
            content: "⏸ queue is already paused.",
            ephemeral: true,
          });
        client.distube.pause(guild);
        return await interaction.reply({ content: "⏸ Song has been paused." });
      }
      case "resume": {
        if (queue.playing)
          return await interaction.reply({
            content: "▶ queue is already playing.",
            ephemeral: true,
          });
        client.distube.resume(guild);
        return await interaction.reply({ content: "▶ Song has been resumed." });
      }
      case "stop": {
        client.distube.stop(guild);
        return await interaction.reply({ content: "⏹ Song has been stopped." });
      }
      case "autoPlay": {
        let mode = await queue.toggleAutoplay(guild);
        return await interaction.reply({
          content: `🔄 Autoplay mode is set to \`${mode ? "on" : "off"}\`.`,
        });
      }
      case "relatedSong": {
        await queue.addRelatedSong(guild);
        return await interaction.reply({
          content: "🈁 a related song has been added.",
        });
      }

      case "repeatMode": {
        let repeatMode = await client.distube.setRepeatMode(queue);
        return await interaction.reply({
          content: `🔁 Repeat mode is set to \`${(repeatMode = repeatMode
            ? repeatMode == 2
              ? "Queue"
              : "Song"
            : "off")}\`.`,
        });
      }
    }
  },
};
