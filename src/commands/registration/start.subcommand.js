const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const EventRegistration = require("../../schemas/registration.schema.js");

const { createRegistrationEmbed } = require("../../helpers/embeds.js");
module.exports = {
  subCommand: "registration.start",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");

    const {
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
    } = require("discord.js");

    const participantButton = new ButtonBuilder()
      .setCustomId("register~participant")
      .setLabel("Participant")
      .setStyle(ButtonStyle.Success);

    const reservistButton = new ButtonBuilder()
      .setCustomId("register~reservist")
      .setLabel("Reservist")
      .setStyle(ButtonStyle.Primary);

    const cancelButton = new ButtonBuilder()
      .setCustomId("register~cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(
      participantButton,
      reservistButton,
      cancelButton
    );

    const embed = createRegistrationEmbed({
      title,
      description,
      participants: [],
      reservists: [],
    });

    const eventMessage = await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    // Save event details in the database
    await EventRegistration.create({
      active: true,
      messageId: eventMessage.id,
      channelId: interaction.channel.id,
      guildId: interaction.guild.id,
      title,
      description,
      participants: [],
      reservists: [],
    });

    await interaction.reply({
      content: "Event registration started!",
      ephemeral: true,
    });
  },
};
