const { ChatInputCommandInteraction } = require("discord.js");
const {
  isValidMusicInteraction,
} = require("../../services/music/music.service");
const musicCountService = require("../../services/music/musicCount.service");

const Distube = require("distube");
module.exports = {
  subCommand: "music.play_favorites",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, member, channel } = interaction;

    const valid = await isValidMusicInteraction(interaction);
    if (!valid) return;

    await interaction.deferReply();
    let topSongs = await musicCountService.getUserFavoriteMusic({
      userId: member.id,
      limit: 15,
    });

    const songs = topSongs.map((song) => song.link);

    const playlist = await client.distube.createCustomPlaylist(songs);

    client.distube.play(member.voice.channel, playlist, {
      textChannel: channel,
      member: member,
    });

    return await interaction.editReply({
      content: "🎼 Favorites Song Playlist Received",
    });
  },
};
