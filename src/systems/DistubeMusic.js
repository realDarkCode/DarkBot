const { EmbedBuilder } = require("discord.js");
const {
  updateMusicStatus,
  updateRuntimeStatus,
} = require("../services/botPresence.discord");

const {
  generateMusicPlayerStatus,
  updateMusicPlayerStatus,
  clearPlayer,
} = require("../services/music/music.service");

const { updateMusicCount } = require("../services/music/musicCount.service");

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
      clearPlayer(queue);
      queue.playerIntervalId = setInterval(async () => {
        await updateMusicPlayerStatus(queue);
      }, 1000 * 1);
      updateMusicStatus(queue);
    })
    .on("deleteQueue", (queue) => {
      clearPlayer(queue);
      updateRuntimeStatus(queue.client);
    })
    .on("playSong", async (queue, song) => {
      const msg = await queue.textChannel.send(
        generateMusicPlayerStatus(queue, song)
      );
      client.musicControllerMsgId = msg.id;
      updateMusicStatus(queue);
    })
    .on("finishSong", async (queue) => {
      const song = queue.songs[0];
      updateMusicCount({
        userId: song.member.id,
        userName: song.member.displayName,
        guildId: song.member.guild.id,
        duration: song.duration,
        songId: song.id,
        name: song.name,
        link: song.url,
      });
      await updateMusicPlayerStatus(queue, true);
    })
    .on("addSong", (queue, song) => {
      updateMusicStatus(queue);
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
              ` Added \`${playlist.name}\`🎶 playlist (${playlist.songs.length} songs) to queue`
            )
            .setThumbnail(playlist.thumbnail),
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
      updateRuntimeStatus(channel.client);
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
      clearPlayer(queue);
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
      clearPlayer(queue);
    })
    .on("disconnect", (queue) => {
      updateRuntimeStatus(queue.client);
      clearPlayer(queue);
    });
};

module.exports = handleDistubeEvent;
