const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");
const { isValidSchedule } = require("../../helpers/date.js");

module.exports = {
  subCommand: "alert.remove",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const id = interaction.options.getString("id");

    const deleted = await AlertMessage.deleteOne({ shortId: id }).exec();

    if (!deleted)
      return interaction.reply({
        content: "No scheduled message found with that ID.",
        ephemeral: true,
      });

    interaction.reply({
      content: "Scheduled message removed successfully.",
      ephemeral: true,
    });
  },
};
