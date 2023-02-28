const { ChatInputCommandInteraction } = require("discord.js");
const { isValidMusicInteraction } = require("../../helpers/music.helper");

module.exports = {
  subCommand: "music.stop",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild } = interaction;

    const valid = await isValidMusicInteraction(interaction);

    if (!valid) return;

    client.distube.stop(guild);

    interaction.reply({ content: "⏹ Music has been stopped." });
  },
};
