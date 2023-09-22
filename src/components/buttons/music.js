const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const {
  isValidMusicInteraction,
  resetPlayer,
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
      return interaction.reply({
        content: "This is outdated please use the latest message button.",
        ephemeral: true,
      });

    const queue = await client.distube.getQueue(guild);

    const SEEK_TIME = 15;
    const VOLUME_AMOUNT = 10;
    const embed = new EmbedBuilder();

    const replyInteraction = async (content) => {
      updateMusicPlayerStatus(queue);
      return await interaction.reply(content);
    };

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
          ephemeral: true,
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
            ephemeral: true,
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
            ephemeral: true,
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
          ephemeral: true,
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
        resetPlayer(queue);
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
        await queue.shuffle(guild);

        return await replyInteraction({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔀 Shuffle is now ${queue.shuffle ? "**on**" : "**off**"}`
              ),
          ],
          ephemeral: true,
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
          ephemeral: true,
        });
      }
      case "increaseVolume": {
        client.distube.setVolume(guild, queue.volume + VOLUME_AMOUNT);
        return await replyInteraction({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔊 Volume has been increased to ${queue.volume + 10}`
              ),
          ],
          ephemeral: true,
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
          ephemeral: true,
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
          ephemeral: true,
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
