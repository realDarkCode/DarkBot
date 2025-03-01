const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registration")
    .setDescription("Manage event registration")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start an event registration.")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("Event title")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Event description")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("end").setDescription("End the event registration.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Manually add a user to the registration list.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Enter the name")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Add as participant or reservist")
            .setRequired(true)
            .addChoices(
              { name: "Participant", value: "participant" },
              { name: "Reservist", value: "reservist" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Manually remove a user from the registration list.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name to remove")
            .setRequired(true)
        )
    ),
};
