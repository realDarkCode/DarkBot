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

    const SEEK_TIME = 10;
    const VOLUME_AMOUNT = 10;
    const embed = new EmbedBuilder();

    switch (buttonInfo[0]) {
      case "seekBackward": {
        if (queue.currentTime < SEEK_TIME) {
          client.distube.seek(guild, queue.duration - queue.currentTime);
        } else {
          client.distube.seek(guild, queue.currentTime - SEEK_TIME);
        }
        return await interaction.reply({
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
          return await interaction.reply({
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
          return await interaction.reply({
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
        if (queue.currentTime + SEEK_TIME > queue.duration) {
          client.distube.seek(guild, queue.duration);
        } else {
          client.distube.seek(guild, queue.currentTime + SEEK_TIME);
        }
        return await interaction.reply({
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
      case "nextSong": {
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
      case "toggleShuffle": {
        await queue.shuffle(guild);

        return await interaction.reply({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔀 Shuffle is now ${queue.shuffle ? "**on**" : "**off**"}`
              ),
          ],
        });
      }
      case "decreaseVolume": {
        if (queue.volume <= 0 || queue.volume - VOLUME_AMOUNT <= 0) {
          return await interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setDescription("⏩ Volume is already lower."),
            ],
            ephemeral: true,
          });
        }
        client.distube.setVolume(guild, queue.volume - VOLUME_AMOUNT);
        return await interaction.reply({
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
        if (queue.volume >= 100 || queue.volume + VOLUME_AMOUNT >= 100) {
          return await interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setDescription("⏩ Volume is already high enough."),
            ],
            ephemeral: true,
          });
        }
        client.distube.setVolume(guild, queue.volume + VOLUME_AMOUNT);
        return await interaction.reply({
          embeds: [
            embed
              .setColor("Yellow")
              .setDescription(
                `🔊 Volume has been increased to ${queue.volume + 10}`
              ),
          ],
        });
      }
      case "toggleAutoplay": {
        let mode = await queue.toggleAutoplay(guild);
        return await interaction.reply({
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

        return await interaction.reply({
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
        return await interaction.reply({
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
