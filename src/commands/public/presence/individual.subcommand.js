const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const presenceService = require("../../../services/presence/userPresence");
const { getPresenceStatusEmoji } = require("../../../helpers/convert");
module.exports = {
  subCommand: "presence.individual",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, guildId } = interaction;
    const targetUser = options.getUser("target");
    const response = new EmbedBuilder()
      .setTitle("User Presence")
      .setColor("Orange")
      .setFooter({ text: "This data only update when user status is changed" })
      .setTimestamp();
    await interaction.deferReply({ ephemeral: true });

    presence = await presenceService.getAUserPresence(guildId, targetUser.id);

    if (presence) {
      response
        .setDescription(
          [
            `**Name:** \`${presence.userName}\``,
            `**Status:** ${getPresenceStatusEmoji(presence.status)} - ${
              presence.status
            }`,
            `**lastUpdatedAt:** <t:${Math.round(
              new Date(presence.updatedAt).getTime() / 1000
            )}:R>`,
          ].join("\n")
        )
        .setThumbnail(targetUser.avatarURL());
    } else {
      response
        .setColor("Yellow")
        .setDescription(
          "No user data found. Please wait for a while to user presence get changed"
        );
    }
    interaction.editReply({ embeds: [response] });
  },
};
