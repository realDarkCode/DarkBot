const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const musicCountService = require("../../services/music/musicCount.service");
const { secondsToDuration } = require("../../helpers/convert");
module.exports = {
  subCommand: "music.favorites",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { user } = interaction;

    const responseEmbed = new EmbedBuilder()
      .setTitle("Your Favorites Musics")
      .setColor("DarkBlue");

    const topSongs = await musicCountService.getUserFavoriteMusic({
      userId: user.id,
    });

    responseEmbed.setDescription(
      topSongs.length === 0
        ? "You haven't listened to any song yet. please listen songs"
        : topSongs
            .map(
              (song, index) =>
                `${index + 1}.[\`${song.count} times\`]-${song.name.slice(
                  0,
                  30
                )}... \`${secondsToDuration(
                  song.duration || 0
                )}\` -<t:${Math.round(song.updatedAt / 1000)}:R>`
            )
            .join("\n")
    );

    await interaction.reply({ embeds: [responseEmbed] });
  },
};
