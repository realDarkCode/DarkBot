const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const musicCountService = require("../../services/music/musicCount.service");

const numEmoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
module.exports = {
  subCommand: "music.search",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, guild, client } = interaction;

    const searchTerm = options.getString("query");
    const type = options.getString("type") || "video";
    const limit = options.getNumber("limit") || 10;

    await interaction.deferReply();
    const searchResult = await client.distube.search(searchTerm, {
      type,
      limit,
    });

    const responseEmbed = new EmbedBuilder()
      .setTitle("Music Search Result")
      .setDescription(
        `${
          searchResult.length == 0
            ? "No result found with this query"
            : searchResult
                .map(
                  (video, index) =>
                    `${numEmoji[index]} ${video.name.slice(0, 50)} \`${
                      video.formattedDuration || video.length
                    }\` \`${video.type}\` `
                )
                .join("\n")
        }`
      );

    const buttons = [];

    for (let i = 0; i < limit; i++) {
      buttons.push(
        new ButtonBuilder({
          label: numEmoji[i],
          custom_id: `play-${searchResult[i].url}`,
          style: ButtonStyle.Primary,
        })
      );
    }

    const r1 = new ActionRowBuilder().setComponents(buttons.slice(0, 5));
    const r2 = new ActionRowBuilder().setComponents(buttons.slice(5, 10));

    return await interaction.editReply({
      embeds: [responseEmbed],
      components: [r1, r2],
    });
  },
};
