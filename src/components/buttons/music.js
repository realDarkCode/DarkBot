const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const {
  isValidMusicInteraction,
  clearPlayer,
  updateMusicPlayerStatus,
} = require("../../helpers/music.helper");
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
    const msgId = interaction.message.id;
    if (msgId !== interaction.client.musicControllerMsgId)
      return await interaction.reply({
        content: "This is outdated please use the latest message button.",
      });

    const queue = await client.distube.getQueue(guild);

    const SEEK_TIME = 15;
    const VOLUME_AMOUNT = 10;

    const embed = new EmbedBuilder();

    const replyInteraction = async (content) => {
      await updateMusicPlayerStatus(queue);
      return await interaction.editReply(content);
    };

    await interaction.deferReply();

    switch (buttonInfo[0]) {
      case "seekBackward": {
        client.distube.seek(guild, queue.currentTime - SEEK_TIME);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏪ Seeked back ${SEEK_TIME} seconds. \nRequested by:<@${user.id}>`
              ),
          ],
        });
      }

      case "pauseResume": {
        if (queue.paused) {
          client.distube.resume(guild);
          return await replyInteraction({
            embeds: [
              embed
                .setColor("Yellow")
                .setDescription(
                  `▶ Song has been resumed. \nRequest by:<@${user.id}>`
                ),
            ],
          });
        } else {
          client.distube.pause(guild);
          return await replyInteraction({
            embeds: [
              embed
                .setColor("Yellow")
                .setDescription(
                  `▶ Song has been paused. \nRequest by:<@${user.id}>`
                ),
            ],
          });
        }
      }
      case "seekForward": {
        client.distube.seek(guild, queue.currentTime + SEEK_TIME);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏩ Seeked forward ${SEEK_TIME} seconds. \nRequested by:<@${user.id}>`
              ),
          ],
        });
      }

      case "prevSong": {
        await client.distube.previous(guild);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏪ Playing the previous song. \nRequested by:<@${user.id}>`
              ),
          ],
        });
      }
      case "stop": {
        client.distube.stop(guild);
        clearPlayer(queue);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏹ Queue has been Stopped. \nRequest by:<@${user.id}>`
              ),
          ],
        });
      }
      case "nextSong": {
        client.distube.skip(guild);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                `⏩ Playing the next song. \nRequested by:<@${user.id}>`
              ),
          ],
        });
      }
      case "toggleShuffle": {
        queue.shuffle = !queue.shuffle;

        return await replyInteraction({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔀 Shuffle mode set to \`${queue.shuffle}\`  Requested by:<@${user.id}>`
              ),
          ],
        });
      }
      case "decreaseVolume": {
        client.distube.setVolume(guild, queue.volume - VOLUME_AMOUNT);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔉 Volume has been decreased to ${
                  queue.volume - VOLUME_AMOUNT
                }`
              ),
          ],
        });
      }
      case "increaseVolume": {
        client.distube.setVolume(guild, queue.volume + VOLUME_AMOUNT);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔊 Volume has been increased to ${
                  queue.volume + VOLUME_AMOUNT
                }`
              ),
          ],
        });
      }
      case "toggleAutoplay": {
        let mode = await queue.toggleAutoplay(guild);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔁 Autoplay is now ${mode ? "**on**" : "**off**"}`
              ),
          ],
        });
      }
      case "toggleLoop": {
        let repeatMode = await client.distube.setRepeatMode(queue);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔁 Repeat mode is set to \`${
                  repeatMode ? (repeatMode == 2 ? "Queue" : "Song") : "off"
                }\`.`
              ),
          ],
        });
      }
      case "viewQueue": {
        return await replyInteraction({
          embeds: [
            embed.setColor("Blue").setDescription(
              `${queue.songs.map((song, index) => {
                if (index < 30) {
                  return `\n**${index + 1}**. ${song.name} - \`${
                    song.formattedDuration
                  }\``;
                } else {
                  return `too many songs to display.`;
                }
              })}`
            ),
          ],
        });
      }
    }
  },
};
