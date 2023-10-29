const { ChatInputCommandInteraction } = require("discord.js");
const {
  isValidMusicInteraction,
} = require("../../services/music/music.service");

module.exports = {
  subCommand: "music.skip",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const valid = await isValidMusicInteraction(interaction);
    if (!valid) return;

    const skipAmount = options.getNumber("amount");

    const queue = client.distube.getQueue(guild);

    if (queue.songs.length <= skipAmount) {
      return await interaction.reply({
        content: "Skip amount must be less than queue length",
        ephemeral: true,
      });
    }

    client.distube.jump(guild, skipAmount);

    await interaction.reply({
      content: `skipped \`${skipAmount}\` songs`,
    });
  },
};
