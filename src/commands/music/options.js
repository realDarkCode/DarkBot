const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { isValidMusicInteraction } = require("../../helpers/music.helper");

module.exports = {
  subCommand: "music.options",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, guild, options } = interaction;

    const valid = await isValidMusicInteraction(interaction);
    if (!valid) return;

    const queue = client.distube.getQueue(guild);
    switch (options.getString("options")) {
      case "queue": {
        return interaction.reply({
          embeds: [
            new EmbedBuilder().setColor("Blue").setDescription(
              `${queue.songs.map((song, id) => {
                if (id < 30) {
                  return `\n**${id + 1}**. ${song.name} - \`${
                    song.formattedDuration
                  }\``;
                }
              })}`
            ),
          ],
        });
      }
      case "shuffle": {
        await queue.shuffle(guild);
        return interaction.reply({
          content: "🔀 The Queue has been shuffled.",
        });
      }
      case "autoPlay": {
        let mode = await queue.toggleAutoplay(guild);
        return interaction.reply({
          content: `🔄 Autoplay mode is set to \`${mode ? "on" : "off"}\`.`,
        });
      }

      case "relatedSong": {
        await queue.addRelatedSong(guild);
        return interaction.reply({
          content: "🈁 a related song has been added.",
        });
      }

      case "repeatMode": {
        let repeatMode = await client.distube.setRepeatMode(queue);
        return interaction.reply({
          content: `🔁 Repeat mode is set to \`${(repeatMode = repeatMode
            ? repeatMode == 2
              ? "Queue"
              : "Song"
            : "off")}\`.`,
        });
      }
      default:
        break;
    }
  },
};
