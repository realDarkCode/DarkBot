const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

const {
  generateProgressBar,
  secondsToDuration,
} = require("../../helpers/convert");
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @returns
 */
const isValidMusicInteraction = async (interaction, queueRequired = true) => {
  const { member, guild, options } = interaction;
  const memberVoiceChanelId = member.voice.channelId;
  const botVoiceChannelId = guild.members.me.voice.channelId;

  if (!memberVoiceChanelId) {
    await interaction.reply({
      content: `You must be in a voice channel to be able to play music.`,
      ephemeral: true,
    });
    return false;
  } else if (botVoiceChannelId && botVoiceChannelId !== memberVoiceChanelId) {
    await interaction.reply({
      content: `I'm already playing music in <#${botVoiceChannelId}>. join this channel`,
      ephemeral: true,
    });
    return false;
  } else if (queueRequired) {
    const queue = await interaction.client.distube.getQueue(guild);
    if (!queue) {
      interaction.reply({
        content: "⛔ There is no queue playing at this moment.",
        ephemeral: true,
      });
      return false;
    }
  }
  return true;
};

const generateMusicStatusButtons = (queue) => {
  const firstRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~seekBackward")
        .setLabel("⏪")
        .setStyle(ButtonStyle.Success)
        .setDisabled(queue.currentTime <= 15)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~pauseResume")
        .setLabel("⏯")
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~stop")
        .setLabel("⏹️")
        .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~seekForward")
        .setLabel("⏩")
        .setStyle(ButtonStyle.Success)
        .setDisabled(queue.currentTime + 15 >= queue.songs[0].duration)
    );
  const secondRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~prevSong")
        .setLabel("⏮")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(queue.previousSongs.length === 0)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~toggleLoop")
        .setLabel("🔁")
        .setStyle(ButtonStyle.Success)
    )

    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~toggleAutoplay")
        .setLabel("🈁")
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~nextSong")
        .setLabel("⏭")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(queue.autoplay ? false : queue.songs.length === 1)
    );

  const thirdRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~decreaseVolume")
        .setLabel("🔉")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(queue.volume <= 10)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~viewQueue")
        .setLabel("🔢")
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~toggleShuffle")
        .setLabel("🔀")
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("music~increaseVolume")
        .setLabel("🔊")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(queue.volume >= 90)
    );

  return [firstRow, secondRow, thirdRow];
};

const generateMusicPlayerStatus = (queue, song, completed = false) => {
  const previousSongsLength = queue.previousSongs.reduce(
    (store, curr) => {
      const duration = curr.stream.playFromSource ? curr.duration : curr.stream.song.duration;

      return store + duration;
    },
    0
  );
  const songDuration = song.stream.playFromSource ? song.duration : song.stream.song.duration;

  let queuePlayedLength = previousSongsLength + queue.currentTime;
  if (completed) queuePlayedLength += songDuration;
  // const totalQueueLength = previousSongsLength + songDuration;
  const totalQueueLength = queue.duration;

  return {
    embeds: [
      new EmbedBuilder()
        .setColor(completed ? "Grey" : "DarkPurple")
        .setThumbnail(song.thumbnail)
        .setDescription(
          [
            `**${completed ? "Played" : "Playing"}:** \`${song.name}\` - \`${song.formattedDuration
            }\` `,
            `**Requested by: **${song.user} `,
            `**Duration:** ${completed
              ? `\`${secondsToDuration(
                songDuration
              )}\`/\`${secondsToDuration(songDuration)}\``
              : `\`${secondsToDuration(
                queue.currentTime
              )}\`/\`${secondsToDuration(songDuration)}\``
            }`,
            `${completed
              ? `${generateProgressBar(songDuration, songDuration, 35)} `
              : `${generateProgressBar(
                queue.currentTime,
                songDuration,
                35
              )} `
            }`,
            "",
            `Status: \`${completed ? `Completed` : queue.paused ? "Paused" : "Playing"
            }\` | Queue: \`${secondsToDuration(
              queuePlayedLength
            )}\` / \`${secondsToDuration(totalQueueLength)}\` | Songs: \`${queue.previousSongs.length + 1
            }/${queue.songs.length + queue.previousSongs.length}\``,
            `Loop: \`${queue.repeatMode
              ? queue.repeatMode === 2
                ? "Queue"
                : "Song"
              : "Off"
            }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\` | Shuffle: \`${queue.shuffle ? "On" : "Off"
            }\``,
            `Filter: \`${queue.filters.values[0]?.name || "Off"}\` | Volume: \`${queue.volume}%\``,
          ].join("\n")
        )
        .setFooter({ text: `Channel: ${song.uploader.name}` })
        .setTimestamp(),
    ],

    components: completed ? [] : generateMusicStatusButtons(queue),
  };
};

const updateMusicPlayerStatus = async (queue, completed) => {
  if (!queue.client.musicControllerMsgId) return;
  const msg = await queue?.textChannel?.messages.cache.get(
    queue.client.musicControllerMsgId
  );

  if (!msg) return;

  const song = queue.songs[0];
  if (!song) return;
  if (completed) resetPlayer(queue);
  await msg.edit(generateMusicPlayerStatus(queue, song, completed));
};

const clearPlayer = (queue) => {
  resetPlayer(queue);
  clearInterval(queue.playerIntervalId);
};

const resetPlayer = (queue) => {
  queue.client.musicControllerMsgId = null;
};
module.exports = {
  isValidMusicInteraction,
  generateMusicPlayerStatus,
  updateMusicPlayerStatus,
  resetPlayer,
  clearPlayer,
};
