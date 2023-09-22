const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

const { generateProgressBar, secondsToDuration } = require("./convert");
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @returns
 */
const isValidMusicInteraction = async (interaction) => {
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
  } else if (options?.getSubcommand() !== "play") {
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

const generateMusicPlayerStatus = (queue, song) => {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor("DarkPurple")
        .setThumbnail(song.thumbnail)
        .setDescription(
          [
            `**Playing:** \`${song.name}\` - \`${song.formattedDuration}\` `,
            `**Requested by: **${song.user} `,
            `**Duration:** \`${secondsToDuration(
              queue.currentTime
            )}\`/\`${secondsToDuration(song.duration)}\` `,
            `${generateProgressBar(queue.currentTime, song.duration, 35)} `,
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
            }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\` | Shuffle: \`${
              queue.shuffle ? "On" : "Off"
            }\``,
          ].join("\n")
        )
        .setFooter({ text: song.uploader.name })
        .setTimestamp(),
    ],

    components: generateMusicStatusButtons(),
  };
};

const updateMusicPlayerStatus = async (queue) => {
  if (!queue.client.musicControllerMsgId) return;
  const msg = await queue?.textChannel?.messages.cache.get(
    queue.client.musicControllerMsgId
  );

  if (!msg) return;

  const song = queue.songs[0];
  await msg.edit(generateMusicPlayerStatus(queue, song));
};

const resetPlayer = (queue) => {
  queue.client.musicControllerMsgId = null;
  clearInterval(queue.playerIntervalId);
};
module.exports = {
  isValidMusicInteraction,
  generateMusicPlayerStatus,
  updateMusicPlayerStatus,
  resetPlayer,
};
