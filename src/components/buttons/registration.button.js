const { ButtonInteraction } = require("discord.js");
const EventRegistration = require("../../schemas/registration.schema.js");
const { createRegistrationEmbed } = require("../../helpers/embeds.js");
module.exports = {
  data: {
    name: "register",
  },
  /***
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { message, buttonInfo, member } = interaction;

    const event = await EventRegistration.findOne({
      messageId: message.id,
      guildId: message.guild.id,
      active: true,
    });

    if (!event || !event.active) {
      return interaction.reply({
        content: "This registration is closed.",
        ephemeral: true,
      });
    }

    interaction.deferReply({ ephemeral: true });

    let updatedParticipants = event.participants;
    let updatedReservists = event.reservists;

    const name = member.displayName || member.user.username;

    if (buttonInfo[0] === "participant") {
      if (!updatedParticipants.includes(name)) {
        updatedParticipants.push(name);
        updatedReservists = updatedReservists.filter((n) => n !== name);
      }
    } else if (buttonInfo[0] === "reservist") {
      if (!updatedReservists.includes(name)) {
        updatedReservists.push(name);
        updatedParticipants = updatedParticipants.filter((n) => n !== name);
      }
    } else if (buttonInfo[0] === "cancel") {
      updatedParticipants = updatedParticipants.filter((n) => n !== name);
      updatedReservists = updatedReservists.filter((n) => n !== name);
    }

    await EventRegistration.findOneAndUpdate(
      { messageId: message.id, guildId: message.guild.id },
      { participants: updatedParticipants, reservists: updatedReservists }
    );

    const embed = createRegistrationEmbed({
      title: event.title,
      description: event.description,
      participants: updatedParticipants,
      reservists: updatedReservists,
    });

    await message.edit({ embeds: [embed] });

    await interaction.followUp({
      content: "Registration updated!",
      ephemeral: true,
    });
  },
};
