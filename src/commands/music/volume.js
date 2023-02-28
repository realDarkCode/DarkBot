const { ChatInputCommandInteraction } = require("discord.js");
const { isValidMusicInteraction } = require("../../helpers/music.helper");

module.exports = {
  subCommand: "music.volume",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const valid = await isValidMusicInteraction(interaction);
    if (!valid) return;

    const volumeInNumber = options.getNumber("volume");
    client.distube.setVolume(guild, volumeInNumber);

    interaction.reply({
      content: `🔊 Volume has been set to \`${volumeInNumber}%\``,
    });
  },
};
