const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

const MemberLogDB = require("../../../schemas/memberLog.schema");

module.exports = {
  subCommand: "setup.member_log",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options, client, channel } = interaction;

    const logChannel = options.getChannel("log_channel") || channel;
    const memberRoleId = options.getRole("member_role")?.id || null;
    const botRoleId = options.getRole("bot_role")?.id || null;

    const guildConfig = {
      guildId: guild.id,
      logChannelId: logChannel.id,
      memberRoleId,
      botRoleId,
    };

    // Update config to database
    await MemberLogDB.findOneAndUpdate(
      { guildId: guild.id },
      {
        ...guildConfig,
        guildName: guild.name,
        logChannelName: logChannel.name,
      },
      { upsert: true, new: true }
    );

    // Update config to local client
    client.guildConfig.set(guild.id, guildConfig);

    // Response back to command
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Member Log Updated")
      .setDescription(
        [
          `- Logging Channel: <#${logChannel.id}>`,
          `- Member Auto-Role: ${
            memberRoleId ? `<@&${memberRoleId}>` : "`Not Specified`"
          }`,
          `- Bot Auto-Role: ${
            botRoleId ? `<@&${botRoleId}>` : "`Not Specified`"
          }`,
        ].join("\n")
      );

    interaction.reply({ embeds: [embed] });
  },
};
