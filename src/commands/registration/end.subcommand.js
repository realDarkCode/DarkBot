const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const EventRegistration = require("../../schemas/registration.schema.js");
const { createRegistrationEmbed } = require("../../helpers/embeds.js");
module.exports = {
  subCommand: "registration.end",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const event = await EventRegistration.findOne({
      channelId: interaction.channel.id,
      guildId: interaction.guildId,
      active: true,
    });

    if (!event) {
      return interaction.reply({
        content: "No active registration found in this channel.",
        ephemeral: true,
      });
    }

    const channel = await interaction.client.channels.fetch(event.channelId);
    const message = await channel.messages.fetch(event.messageId);

    if (message) {
      const embed = createRegistrationEmbed(event).setFooter({
        text: "Registration closed!",
      });
      await message.edit({ embeds: [embed], components: [] });
    }

    await EventRegistration.findOneAndUpdate(
      { messageId: event.messageId, guildId: interaction.guildId },
      { active: false }
    );

    await interaction.reply({
      content: "Registration has been closed!",
    });
  },
};
