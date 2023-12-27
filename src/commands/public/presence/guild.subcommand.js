const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

const presenceService = require("../../../services/presence/userPresence");
const { getPresenceStatusEmoji } = require("../../../helpers/convert");
module.exports = {
  subCommand: "presence.guild",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guildId } = interaction;
    const response = new EmbedBuilder()
      .setTitle("Guild Members Presence")
      .setColor("Orange")
      .setFooter({ text: "This data only update when user status is changed" })
      .setTimestamp();

    membersPresence = await presenceService.getAllUserPresence(guildId);

    response.setDescription(
      membersPresence.length === 0
        ? "No data recorded yet. please wait a while"
        : membersPresence
            .map(
              (presence, index) => `${index + 1}. \`${
                presence.userName
              }\` - ${getPresenceStatusEmoji(
                presence.status
              )} - <t:${Math.round(
                new Date(presence.updatedAt).getTime() / 1000
              )}:R>
              `
            )
            .join("\n")
    );

    interaction.reply({ embeds: [response], ephemeral: true });
  },
};
