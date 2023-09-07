const {
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  updateMusicStatus,
  updateRuntimeStatus,
} = require("../services/botPresence.discord");

const generateButtons = () => {
  const firstRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-prev")
        .setLabel("⏪")
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-pause_resume")
        .setLabel("⏯")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-stop")
        .setLabel("⏹")
        .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-next")
        .setLabel("⏩")
        .setStyle(ButtonStyle.Success)
    );
  return [firstRow];
};
/**
 *
 * @param {Client} client
 */
const handleDistubeEvent = async (client) => {
  const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${
      queue.filters.names.join(", ") || "Off"
    }\` | Loop: \`${
      queue.repeatMode
        ? queue.repeatMode === 2
          ? "All Queue"
          : "This Song"
        : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
  client.distube

    .on("initQueue", (queue) => {
      queue.autoplay = false;
      queue.volume = 70;

      clearInterval(queue.client.activityIntervalId);
      updateMusicStatus(queue);
    })
    .on("playSong", (queue, song) => {
      updateMusicStatus(queue);

      queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `🎵 Playing \`${song.name}\` - \`${
                song.formattedDuration
              }\`\nRequested by: ${song.user}\n${status(queue)}`
            ),
        ],
        components: generateButtons(),
      });
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
      updateMusicStatus(queue);

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
      updateMusicStatus(queue);

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
