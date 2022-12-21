const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emit guild events")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
      option
        .setName("guild_member")
        .setDescription("emit member joins/leave")
        .setChoices(
          { name: "join", value: "guildMemberAdd" },
          { name: "leave", value: "guildMemberRemove" }
        )
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, options, member } = interaction;

    const emitOption = options.getString("guild_member");
    client.emit(emitOption, member);

    interaction.reply({ content: `Emitted ${emitOption}`, ephemeral: true });
  },
};
