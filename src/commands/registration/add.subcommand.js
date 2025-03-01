const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const EventRegistration = require("../../schemas/registration.schema.js");
const { createRegistrationEmbed } = require("../../helpers/embeds.js");
module.exports = {
  subCommand: "registration.add",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guildId, channelId } = interaction;
    const name = interaction.options.getString("name");
    const type = interaction.options.getString("type");
    const event = await EventRegistration.findOne({
      channelId: channelId,
      guildId: guildId,
      active: true,
    });

    if (!event) {
      return interaction.reply({
        content: "No active registration found in this channel.",
        ephemeral: true,
      });
    }

    let updatedParticipants = event.participants;
    let updatedReservists = event.reservists;

    if (type === "participant") {
      if (!updatedParticipants.includes(name)) {
        updatedParticipants.push(name);
        updatedReservists = updatedReservists.filter((n) => n !== name);
      }
    } else {
      if (!updatedReservists.includes(name)) {
        updatedReservists.push(name);
        updatedParticipants = updatedParticipants.filter((n) => n !== name);
      }
    }

    await EventRegistration.findOneAndUpdate(
      { messageId: event.messageId, guildId: event.guildId },
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
      await message.edit({
        embeds: [embed],
      });
    }

    await interaction.reply({
      content: `Added \`${name}\` as a \`${type}\`.`,
    });
  },
};
