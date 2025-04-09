const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alert")
    .setDescription("Manage alert messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a new alert message to this channel.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message to send")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("schedule")
            .setDescription(
              "schedule in format (example: Wednesday 12:00, Friday 4:00)"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("repeat")
            .setDescription("Whether to repeat the messages or sent once")
            .addChoices([
              { name: "On", value: "true" },
              { name: "Off", value: "false" },
            ])
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all alert messages.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list_guild")
        .setDescription("List all alert messages.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit an alert message.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the alert message to edit")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("message").setDescription("Message to send")
        )
        .addStringOption((option) =>
          option
            .setName("schedule")
            .setDescription("schedule in format: Wednesday 12:00, Friday 4:00")
        )
        .addStringOption((option) =>
          option
            .setName("repeat")
            .setDescription("Whether to repeat the messages or sent once")
            .addChoices([
              { name: "On", value: "true" },
              { name: "Off", value: "false" },
            ])
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Delete an alert message.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the alert message to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View individual alert message.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the alert message to view")
            .setRequired(true)
        )
    ),
};
