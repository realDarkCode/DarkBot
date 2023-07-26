const { ButtonInteraction, EmbedBuilder } = require("discord.js");
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
    const { buttonInfo, guild, client, user } = interaction;
    const isValid = await isValidMusicInteraction(interaction);
    if (!isValid) return;
    const queue = await client.distube.getQueue(guild);

    const embed = new EmbedBuilder();

    switch (buttonInfo[0]) {
      case "prev": {
        if (!queue.previousSongs.length) {
          return await interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setDescription("⏪ There is no previous song to play."),
            ],
            ephemeral: true,
          });
        }
        await client.distube.previous(guild);
        return await interaction.reply({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏪ Playing the previous song. \nRequested by:<@${user.id}>`
              ),
          ],
        });
      }

      case "next": {
        if (queue.songs.length <= 1) {
          return await interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setDescription("⏩ There is no next song to play."),
            ],
            ephemeral: true,
          });
        }
        client.distube.skip(guild);
        return await interaction.reply({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏩ Playing the next song. \nRequested by:<@${user.id}>`
              ),
          ],
        });
      }
      case "pause_resume": {
        if (queue.paused) {
          client.distube.resume(guild);
          return await interaction.reply({
            embeds: [
              embed
                .setColor("Green")
                .setDescription(
                  `▶ Song has been resumed. \nRequest by:<@${user.id}>`
                ),
            ],
          });
        } else {
          client.distube.pause(guild);
          return await interaction.reply({
            embeds: [
              embed
                .setColor("Green")
                .setDescription(
                  `▶ Song has been paused. \nRequest by:<@${user.id}>`
                ),
            ],
          });
        }
      }
      case "stop": {
        client.distube.stop(guild);
        return await interaction.reply({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏹ Queue has been Stopped. \nRequest by:<@${user.id}>`
              ),
          ],
        });
      }
    }
  },
};
