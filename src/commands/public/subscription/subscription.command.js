const { SlashCommandBuilder } = require("discord.js");
const { convertToChoices } = require("../../../helpers/convert");
const optionConfig = require("../../../config/options.config");

if (!optionConfig.serviceList) return;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("subscription")
    .setDescription(
      "Subscribe/unsubscribe to different different service offered by the server"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subscribe")
        .setDescription("Subscribes to a specific service")
        .addStringOption((option) =>
          option
            .setName("service")
            .setDescription("Select the service")
            .setRequired(true)
            .addChoices(
              ...convertToChoices(optionConfig.serviceList.map((s) => s.name))
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unsubscribe")
        .setDescription("Unsubscribes to a specific service")
        .addStringOption((option) =>
          option
            .setName("service")
            .setDescription("Select the service")
            .setRequired(true)
            .addChoices(
              ...convertToChoices(optionConfig.serviceList.map((s) => s.name))
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Show the list of available services in the server")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("my_services")
        .setDescription(
          "see the list of services you have used or using currently"
        )
    ),
};
