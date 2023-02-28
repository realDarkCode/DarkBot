const { ChatInputCommandInteraction } = require("discord.js");
const { isValidMusicInteraction } = require("../../helpers/music.helper");

module.exports = {
  subCommand: "music.play",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, options, member, channel } = interaction;

    const valid = await isValidMusicInteraction(interaction);

    if (!valid) return;

    const query = options.getString("query");

    client.distube.play(member.voice.channel, query, {
      textChannel: channel,
      member: member,
    });

    interaction.reply({ content: "🎼 Request Received" });
  },
};
