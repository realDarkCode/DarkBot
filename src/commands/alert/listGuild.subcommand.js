const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");

module.exports = {
  subCommand: "alert.list_guild",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const AlertMessages = await AlertMessage.find({
      guildId: interaction.guildId,
    });

    if (AlertMessages.length === 0) {
      return interaction.reply("No scheduled messages found in this guild.");
    }

    let reply = new EmbedBuilder()
      .setTitle("Scheduled Messages in this sever")
      .setDescription(
        AlertMessages.map(
          (msg, i) =>
            `${i + 1}. \`${msg.shortId}\` **${msg.message}** in <#${
              msg.channelId
            }>  at \`${msg.schedule
              .map((s) => `${s.day} ${s.time} UTC`)
              .join(", ")}\``
        ).join("\n")
      );

    return await interaction.reply({ embeds: [reply] });
  },
};
