const { EmbedBuilder } = require("discord.js");
const {
  updateMusicStatus,
  updateRuntimeStatus,
} = require("../services/botPresence.discord");

const {
  generateMusicPlayerStatus,
  updateMusicPlayerStatus,
  resetPlayer,
} = require("../helpers/music.helper");
/**
 *
 * ⏪⏯⏹️⏩
 * ⏮🔁🔀⏭
 * 🔉🔢🈁🔊
 */

const handleDistubeEvent = async (client) => {
  client.distube
    .on("initQueue", (queue) => {
      queue.autoplay = false;
      queue.volume = 80;
      queue.shuffle = false;

      clearInterval(queue.client.activityIntervalId);
      resetPlayer(queue);
      updateMusicStatus(queue);

      queue.playerIntervalId = setInterval(() => {
        updateMusicPlayerStatus(queue);
      }, 1000 * 5);
    })
    .on("playSong", async (queue, song) => {
      updateMusicStatus(queue);
      const msg = await queue.textChannel.send(
        generateMusicPlayerStatus(queue, song)
      );
      client.musicControllerMsgId = msg.id;
    })
    .on("addSong", (queue, song) => {
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `🟢 Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
            )
            .setThumbnail(song.thumbnail),
        ],
      });
    })
    .on("addList", (queue, playlist) => {
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              ` Added \`${playlist.name}\`🎶 playlist (${
                playlist.songs.length
              } songs) to queue\n${status(queue)}`
            ),
        ],
      });
    })
    .on("error", (channel, e) => {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `⛔ An error encountered: ${e.toString().slice(0, 1974)}`
            ),
        ],
      });
      console.error(e);
    })
    .on("empty", (queue) => {
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(
              "🔺 Voice channel is empty! Leaving the channel..."
            ),
        ],
      });
      updateRuntimeStatus(queue.client);
    })
    .on("searchNoResult", (message, query) =>
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(`⭕ No result found for \`${query}\`!`),
        ],
      })
    )
    .on("finish", (queue) => {
      queue.textChannel.send({
        embeds: [
          new EmbedBuilder().setColor("Orange").setDescription("✅ Finished!"),
        ],
      });
      updateRuntimeStatus(queue.client);
    })
    .on("disconnect", (queue) => {
      updateRuntimeStatus(queue.client);
    });
};

module.exports = handleDistubeEvent;
