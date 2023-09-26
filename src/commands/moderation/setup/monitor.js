const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

const MemberLogDB = require("../../../schemas/guildConfig.schema");

module.exports = {
  subCommand: "setup.monitor",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options, client, channel } = interaction;

    const logChannel = options.getChannel("announce_channel") || null;
    const adminRoleId = options.getRole("admin_role") || null;

    const _guildConfig = client.guildConfig.get(guild.id);
    const guildConfig = {
      guildId: guild.id,
      guildName: guild.name,
      monitor: {},
    };
    if (logChannel) {
      guildConfig.monitor["announceChannelId"] = logChannel.id;
      guildConfig.monitor["announceChannelName"] = logChannel.name;
    }
    if (adminRoleId) {
      guildConfig.monitor["adminRoleId"] = adminRoleId.id;
      guildConfig.monitor["adminRoleName"] = adminRoleId.name;
    }

    // Update config to database
    await MemberLogDB.findOneAndUpdate(
      { guildId: guild.id },
      {
        ...guildConfig,
      },
      { upsert: true, new: true }
    );

    // Update config to local client
    client.guildConfig.set(guild.id, { ..._guildConfig, ...guildConfig });

    // Response back to command
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Monitor Config Updated")
      .setDescription(
        [
          `- Announcement Channel: ${
            logChannel ? `<#${logChannel.id}>` : "`Not Specified`"
          }`,
          `- Admin Role: ${adminRoleId ? `${adminRoleId}` : "`Not Specified`"}`,
        ].join("\n")
      );

    interaction.reply({ embeds: [embed] });
  },
};
