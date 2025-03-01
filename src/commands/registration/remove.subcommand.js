const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const EventRegistration = require("../../schemas/registration.schema.js");
const { createRegistrationEmbed } = require("../../helpers/embeds.js");

module.exports = {
  subCommand: "registration.remove",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const name = interaction.options.getString("name");

    const event = await EventRegistration.findOne({
      channelId: interaction.channel.id,
      active: true,
    });

    if (!event) {
      return interaction.reply({
        content: "No active registration found in this channel.",
        ephemeral: true,
      });
    }

    const updatedParticipants = event.participants.filter((n) => n !== name);
    const updatedReservists = event.reservists.filter((n) => n !== name);

    await EventRegistration.findOneAndUpdate(
      { messageId: event.messageId, guildId: interaction.guildId },
      { participants: updatedParticipants, reservists: updatedReservists }
    );

    const embed = createRegistrationEmbed({
      title: event.title,
      description: event.description,
      participants: updatedParticipants,
      reservists: updatedReservists,
    });

    const channel = await interaction.client.channels.fetch(event.channelId);
    const message = await channel.messages.fetch(event.messageId);

    if (message) {
      await message.edit({ embeds: [embed] });
    }

    await interaction.reply({
      content: `Removed \`${name}\` from the registration.`,
    });
  },
};
