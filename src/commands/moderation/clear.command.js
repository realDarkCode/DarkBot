const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages from a channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of message you want to remove")
        .setMaxValue(1)
        .setMaxValue(99)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Specify the reason you want to remove these messages")
        .setMinLength(3)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription(
          "Specify a member if you want to remove that member's messages"
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, guildId, member, options, client, guild } = interaction;

    const amount = options.getNumber("amount");
    const reason = options.getString("reason");
    const target = options.getUser("target");

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("Bulk message deletion");

    const handleBulkDeleteSuccess = async (deletedMessages) => {
      interaction.reply({
        ephemeral: true,
        embeds: [
          embed.setDescription(
            `Deleted ${deletedMessages.size} messages ${
              target ? ` from ${target}` : ""
            }.`
          ),
        ],
      });

      // TODO: response to bot log channel
      const guildConfig = client.guildConfig.get(guildId);
      if (!guildConfig?.botLogChannelId) return;

      const botLogChannel = guild.channels.cache.get(
        guildConfig.botLogChannelId
      );

      const descriptionArray = [
        `- Moderator: <@${member.id}>`,
        `- Channel: <#${channel.id}>`,
        `${target ? `- Target: <@${target.id}>` : ``}`,
        `- Message Deleted: \`${deletedMessages.size}\``,
      ];

      const logResponse = new EmbedBuilder()
        .setTitle("Cleared bulk messages")
        .setColor("Yellow")
        .setDescription(descriptionArray.join("\n"))
        .setFooter({ text: "Performed bulk message deletion" })
        .setTimestamp();

      await botLogChannel.send({ embeds: [logResponse] });
    };

    const handleBulkDeleteError = (error) => {
      interaction.reply({
        ephemeral: true,
        embeds: [
          embed
            .setColor("Red")
            .setDescription(
              `**Error occurred while deleting messages.**\n - Error: ${error.title}`
            ),
        ],
      });
    };
    // fetch the channel messages
    const channelMessages = await channel.messages.fetch();
    if (target) {
      // delete message if target is specified
      let count = 0;
      const messagesToDelete = channelMessages.reduce((store, current) => {
        if (current.author.id === target.id && count < amount) {
          store.push(current);
          count++;
        }
        return store;
      }, []);

      channel
        .bulkDelete(messagesToDelete, true)
        .then(handleBulkDeleteSuccess)
        .catch(handleBulkDeleteError);
    } else {
      channel
        .bulkDelete(amount, true)
        .then(handleBulkDeleteSuccess)
        .catch(handleBulkDeleteError);
    }
  },
};
