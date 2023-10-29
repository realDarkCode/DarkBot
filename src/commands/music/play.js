const { ChatInputCommandInteraction } = require("discord.js");
const {
  isValidMusicInteraction,
} = require("../../services/music/music.service");

module.exports = {
  subCommand: "music.play",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, options, member, channel } = interaction;

    const valid = await isValidMusicInteraction(interaction, false);

    if (!valid) return;

    const query = options.getString("query");

    client.distube.play(member.voice.channel, query, {
      textChannel: channel,
      member: member,
    });

    await interaction.reply({ content: "🎼 Request Received" });
  },
};
