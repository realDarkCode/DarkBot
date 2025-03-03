const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");
const { isValidSchedule } = require("../../helpers/date.js");

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

    let reply = "**Scheduled Messages for this Guild:**\n";
    AlertMessages.forEach((msg, i) => {
      reply += `${i + 1}. \`${msg.shortId}\` **${msg.message}** in <#${
        msg.channelId
      }>  at \`${msg.schedule
        .map((s) => `${s.day} ${s.time} UTC`)
        .join(", ")}\`\n`;
    });

    interaction.reply(reply);
  },
};
