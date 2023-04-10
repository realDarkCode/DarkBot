const { ChatInputCommandInteraction } = require("discord.js");

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

module.exports = { isValidMusicInteraction };
