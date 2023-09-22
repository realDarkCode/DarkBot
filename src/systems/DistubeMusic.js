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

/**
 *
 * ⏪⏯⏹️⏩
 * ⏮🔁🔀⏭
 * 🔉🔢🈁🔊
 */
const generateButtons = () => {
  const firstRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-seekBackward")
        .setLabel("⏪")
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-pauseResume")
        .setLabel("⏯")
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-stop")
        .setLabel("⏹️")
        .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-seekForward")
        .setLabel("⏩")
        .setStyle(ButtonStyle.Success)
    );
  const secondRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-prevSong")
        .setLabel("⏮")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-toggleLoop")
        .setLabel("🔁")
        .setStyle(ButtonStyle.Success)
    )

    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-toggleAutoplay")
        .setLabel("🈁")
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-nextSong")
        .setLabel("⏭")
        .setStyle(ButtonStyle.Primary)
    );

  const thirdRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-decreaseVolume")
        .setLabel("🔉")
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-viewQueue")
        .setLabel("🔢")
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-toggleShuffle")
        .setLabel("🔀")
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music-increaseVolume")
        .setLabel("🔊")
        .setStyle(ButtonStyle.Secondary)
    );

  return [firstRow, secondRow, thirdRow];
};

const handleDistubeEvent = async (client) => {
  const status = (queue, song) => {
    return {
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setThumbnail(song.thumbnail)
          .setDescription(
            [
              `**Playing:** \`${song.name}\` - \`${song.formattedDuration}\` `,
              `**Requested by: **${song.user} `,
              `**Duration:** \`${queue.currentTime}\`/\`${song.duration}\` `,
              "",
              `Status: \`${
                queue.paused ? "Paused" : "Playing"
              }\` | Queue Duration: \`${queue.formattedCurrentTime}\` / \`${
                queue.formattedDuration
              }\``,
              `Volume: \`${queue.volume}%\` | Loop: \`${
                queue.repeatMode
                  ? queue.repeatMode === 2
                    ? "Queue"
                    : "Song"
                  : "Off"
              }\` | Autoplay: \`${
                queue.autoplay ? "On" : "Off"
              }\` | Shuffle: \`${queue.shuffle ? "On" : "Off"}\``,
            ].join("\n")
          )
          .setFooter({ text: song.uploader.name })
          .setTimestamp(),
      ],

      components: generateButtons(),
    };
  };

  client.distube
    .on("initQueue", (queue) => {
      queue.autoplay = false;
      queue.volume = 70;
      queue.shuffle = false;
      clearInterval(queue.client.activityIntervalId);
      updateMusicStatus(queue);
    })
    .on("playSong", (queue, song) => {
      updateMusicStatus(queue);
      queue.textChannel.send(status(queue, song));
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
