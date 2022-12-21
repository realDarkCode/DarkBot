const {
  GuildMember,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const moment = require("moment/moment");

module.exports = {
  name: "guildMemberRemove",
  /**
   *
   * @param {GuildMember} member
   */
  async execute(client, member) {
    const { guild } = member;
    const guildMemberLogConfig = client.guildConfig.get(guild.id);

    // check if the member logging system is enabled for the guild
    if (!guildMemberLogConfig) return;

    // Fetch logging channel
    const logChannel = (await guild.channels.fetch()).get(
      guildMemberLogConfig.logChannelId
    );
    if (!logChannel) return;

    const accountCreationTime = parseInt(member.user.createdTimestamp / 1000);
    const guildJoiningTime = parseInt(member.joinedTimestamp / 1000);

    const responseEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.tag} | ${member.id}`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      })
      .setColor("Yellow")
      .setTitle("Rest in peace")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setDescription(
        [
          `* User: ${member.user}`,
          `* Account Type: ${member.user.bot ? "Bot" : "User"}`,
          `* Account Created: <t:${accountCreationTime}:D> | <t:${accountCreationTime}:R>`,
          `* Account Joined: <t:${guildJoiningTime}:D> | <t:${guildJoiningTime}:R>`,
        ].join("\n")
      )
      .setFooter({ text: "left the server" })
      .setTimestamp();

    return logChannel.send({ embeds: [responseEmbed] });
  },
};
