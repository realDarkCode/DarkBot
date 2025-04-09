const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");
const { isValidSchedule } = require("../../helpers/date.js");

module.exports = {
  subCommand: "alert.list",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guildId, channelId } = interaction;

    const alertMessages = await AlertMessage.find({
      channelId,
      guildId,
    });

    if (alertMessages.length === 0) {
      return interaction.reply("No scheduled messages found for this channel.");
    }

    let reply = new EmbedBuilder()
      .setTitle("Scheduled Messages")
      .setDescription(
        alertMessages
          .map(
            (msg, i) =>
              `**${i + 1}.** ID: \`${msg.shortId}\` -  Message: ${
                msg.message
              } - Schedule: \`${msg.schedule
                .map((s) => `${s.day} ${s.time} UTC`)
                .join(", ")}\``
          )
          .join("\n")
      );
    return await interaction.reply({ embeds: [reply] });
  },
};
