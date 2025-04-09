const { EmbedBuilder } = require("discord.js");

function createRegistrationEmbed(event) {
  return new EmbedBuilder()
    .setTitle(event.title)
    .setDescription(
      `${event.description.replace(/\\n/g, "\n")}\n\n \`${
        event.participants.length
      }\` Participants and \`${
        event.reservists.length
      }\` Reservists in total of \`${
        event.participants.length + event.reservists.length
      }\` for members this event.`
    )
    .setColor("#0099ff")
    .addFields(
      {
        name: "📌 Participants",
        value: event.participants.length
          ? event.participants
              .map((name, i) => `${i + 1}. \`${name}\``)
              .join("\n")
          : "None",
        inline: true,
      },
      {
        name: "📝 Reservists",
        value: event.reservists.length
          ? event.reservists
              .map((name, i) => `${i + 1}. \`${name}\``)
              .join("\n")
          : "None",
        inline: true,
      }
    )
    .setFooter({ text: "Click a button to register or cancel registrations." })
    .setTimestamp();
}

module.exports = { createRegistrationEmbed };
