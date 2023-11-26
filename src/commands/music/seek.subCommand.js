const { ChatInputCommandInteraction } = require("discord.js");
const {
  isValidMusicInteraction,
} = require("../../services/music/music.service");
const { secondsToDuration } = require("../../helpers/convert");

module.exports = {
  subCommand: "music.seek",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const valid = await isValidMusicInteraction(interaction);
    if (!valid) return;

    const seekTimeInSeconds = options.getNumber("seconds");

    const queue = client.distube.getQueue(guild);

    const duration = queue.songs[0].duration;

    if (seekTimeInSeconds >= duration) {
      return await interaction.reply({
        content: `Seek time can't be more than song duration`,
        ephemeral: true,
      });
    }

    await client.distube.seek(guild, seekTimeInSeconds);

    await interaction.reply({
      content: `Seek to \`${secondsToDuration(seekTimeInSeconds)}\``,
    });
  },
};
