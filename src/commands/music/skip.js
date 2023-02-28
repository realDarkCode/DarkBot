const { ChatInputCommandInteraction } = require("discord.js");
const { isValidMusicInteraction } = require("../../helpers/music.helper");

module.exports = {
  subCommand: "music.skip",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild } = interaction;

    const valid = await isValidMusicInteraction(interaction);

    if (!valid) return;

    client.distube.skip(guild);

    interaction.reply({ content: "⏩ Song has been skipped." });
  },
};
