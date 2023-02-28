const { ChatInputCommandInteraction } = require("discord.js");
const { isValidMusicInteraction } = require("../../helpers/music.helper");

module.exports = {
  subCommand: "music.resume",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild } = interaction;

    const valid = await isValidMusicInteraction(interaction);

    if (!valid) return;

    client.distube.resume(guild);

    interaction.reply({ content: "⏯ Music has been resumed." });
  },
};
