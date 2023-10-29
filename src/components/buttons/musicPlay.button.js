const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const {
  isValidMusicInteraction,
} = require("../../services/music/music.service");
module.exports = {
  data: {
    name: "play",
  },
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { buttonInfo, client, member, channel } = interaction;
    const isValid = await isValidMusicInteraction(interaction, false);
    if (!isValid) return;

    const link = buttonInfo[0];
    if (!link) return;

    client.distube.play(member.voice.channel, link, {
      textChannel: channel,
      member: member,
    });

    return await interaction.reply({ content: "🎼 Request Received" });
  },
};
