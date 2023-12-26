const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ComponentBuilder,
  ButtonStyle,
} = require("discord.js");
const GuildConfig = require("../../schemas/guildConfig.schema");

module.exports = {
  developerOnly: true,
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription(
      "Post an announcement as embed to configured public announcement channel"
    )
    .setDMPermission(false)
    .addBooleanOption((option) =>
      option.setName("bot_post").setDescription("Post as a bot or admin")
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("set the embed title")
    )
    .addStringOption((option) =>
      option.setName("description").setDescription("set the embed description")
    )
    .addStringOption((option) =>
      option.setName("thumbnail").setDescription("set the embed thumbnail")
    )
    .addStringOption((option) =>
      option.setName("image").setDescription("set the embed image")
    )
    .addStringOption((option) =>
      option.setName("footer_text").setDescription("set the embed footer text")
    )
    .addMentionableOption((option) =>
      option
        .setName("mention1")
        .setDescription(
          "Mention roles/user to mention at the very fast of the announcement"
        )
    )
    .addMentionableOption((option) =>
      option
        .setName("mention2")
        .setDescription(
          "Mention roles/user to mention at the very fast of the announcement"
        )
    )
    .addMentionableOption((option) =>
      option
        .setName("mention3")
        .setDescription(
          "Mention roles/user to mention at the very fast of the announcement"
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, client, user } = interaction;

    // Extract values from interaction
    const isBotPost = options.getBoolean("bot_post");
    const title = options.getString("title");
    const description = options
      .getString("description")
      ?.replace(/(\\n)/g, "\n");
    const thumbnail = options.getString("thumbnail");
    const image = options.getString("image");
    const footer = options.getString("footer_text");
    const mention1 = options.getMentionable("mention1");
    const mention2 = options.getMentionable("mention2");
    const mention3 = options.getMentionable("mention3");

    const responseEmbed = new EmbedBuilder().setColor("Purple");

    if (isBotPost) {
      responseEmbed.setAuthor({
        name: client.user.displayName,
        iconURL: client.user.displayAvatarURL(),
      });
    } else {
      responseEmbed.setAuthor({
        name: user.displayName,
        iconURL: user.displayAvatarURL(),
      });
    }

    title && responseEmbed.setTitle(title);
    description && responseEmbed.setDescription(description);
    thumbnail && responseEmbed.setThumbnail(thumbnail);
    image && responseEmbed.setImage(image);
    footer && responseEmbed.setFooter({ text: footer });

    await interaction.reply({
      content: `Hey \n${mention1 || ""} ${mention2 || ""} ${mention3 || ""}`,
      embeds: [responseEmbed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`announcement~confirm~${user.id}`)
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`announcement~cancel~${user.id}`)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });
  },
};
