const {
  GuildMember,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const moment = require("moment/moment");

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   */
  async execute(client, member) {
    const { guild } = member;
    const guildMemberLogConfig = client.guildConfig.get(guild.id);

    // check if the member logging system is enabled for the guild
    if (!guildMemberLogConfig) return;

    // Assign configured role to member
    const guildRoles = guild.roles.cache;
    let assignRole = member.user.bot
      ? guildRoles.get(guildMemberLogConfig.botRoleId)
      : guildRoles.get(guildMemberLogConfig.memberRoleId);

    if (!assignRole) assignRole = "Not configured";
    else
      await member.roles.add(assignRole).catch(() => {
        assignRole =
          "Failed due to assignable role is higher than the bot role";
      });

    // Fetch logging channel
    const logChannel = (await guild.channels.fetch()).get(
      guildMemberLogConfig.logChannelId
    );
    if (!logChannel) return;

    // Create log embed
    let color = "#74e21e";
    let risk = "Fairy risk";

    const accountCreationTime = parseInt(member.user.createdTimestamp / 1000);
    const guildJoiningTime = parseInt(member.joinedTimestamp / 1000);

    const twoMonthsAgo = moment().subtract(2, "months").unix();
    const twoWeeksAgo = moment().subtract(2, "weeks").unix();
    const twoDaysAgo = moment().subtract(2, "days").unix();

    if (accountCreationTime >= twoMonthsAgo) {
      color = "#e2bb1e";
      risk = "Medium";
    }
    if (accountCreationTime >= twoWeeksAgo) {
      color = "#e24d1e";
      risk = "High";
    }
    if (accountCreationTime >= twoDaysAgo) {
      color = "#e21d1e";
      risk = "Extreme";
    }

    const responseEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.tag} | ${member.id}`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      })
      .setTitle("A new member arrived")
      .setColor(color)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setDescription(
        [
          `* User: ${member.user}`,
          `* Account Type: ${member.user.bot ? "Bot" : "User"}`,
          `* Role Assigned: ${assignRole}`,
          `* Risk Level: ${risk}`,
          `* Account Created: <t:${accountCreationTime}:D> | <t:${accountCreationTime}:R>`,
          `* Account Joined: <t:${guildJoiningTime}:D> | <t:${guildJoiningTime}:R>`,
        ].join("\n")
      )
      .setFooter({ text: "Joined the server" })
      .setTimestamp();

    // Check if the member is risky
    if (risk === "High" || risk === "Extreme") {
      const responseButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`memberLogging-kick-${member.id}`)
          .setLabel("Kick")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`memberLogging-ban-${member.id}`)
          .setLabel("Ban")
          .setStyle(ButtonStyle.Danger)
      );
      return logChannel.send({
        embeds: [responseEmbed],
        components: [responseButton],
      });
    } else {
      return logChannel.send({ embeds: [responseEmbed] });
    }
  },
};
