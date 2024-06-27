const { YouTubePlugin } = require("@distube/youtube");
const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

const ytPlugin = new YouTubePlugin();


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
    let searchResult;
    try {
      searchResult = await ytPlugin.search(searchTerm, {
        type,
        limit,
      });
    } catch (error) {
      searchResult = [];
    }

    const responseEmbed = new EmbedBuilder()
      .setTitle("Music Search Result")
      .setColor("Purple")
      .setDescription(
        `${searchResult.length == 0
          ? "No result found with this query"
          : searchResult
            .map(
              (video, index) =>
                `${numEmoji[index]} ${video.name.slice(0, 50)} \`${video.formattedDuration || video.length
                }\` \`${video.type}\` `
            )
            .join("\n")
        }`
      );
    let r1 = new ActionRowBuilder(),
      r2 = new ActionRowBuilder();
    const buttons = [];
    const components = [];

    if (searchResult.length) {
      for (let i = 0; i < limit; i++) {
        buttons.push(
          new ButtonBuilder({
            label: numEmoji[i],
            custom_id: `play~${searchResult[i].url}`,
            style: ButtonStyle.Primary,
          })
        );
      }
      r1.setComponents(buttons.slice(0, 5));
      if (limit > 5) r2.setComponents(buttons.slice(5, limit));
    }
    if (r1.components.length) components.push(r1);
    if (r2.components.length) components.push(r2);

    return await interaction.editReply({
      embeds: [responseEmbed],
      components,
    });
  },
};
