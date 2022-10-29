const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
} = require("discord.js");
const config = require("../../config/bot");
const ms = require("ms");
module.exports = {
  name: "interactionCreate",

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    const errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: "Error Occurred while executing this command",
      })
      .setFooter({
        text: interaction.user.tag,
      })
      .setTimestamp();
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: "This command is outdated",
        ephemeral: true,
      });
    }
    if (
      command.developerOnly &&
      interaction.user.id !== config.development.developerID
    ) {
      return interaction.reply({
        content: "This command is only for  developer",
        ephemeral: true,
      });
    }

    const subCommand = interaction.options.getSubcommand(false);
    try {
      if (subCommand) {
        const subCommandFile = client.subCommands.get(
          `${interaction.commandName}.${subCommand}`
        );
        if (!subCommandFile) {
          return interaction.reply({
            content: "This sub command is outdated",
            ephemeral: true,
          });
        }
        await subCommandFile.execute(interaction);
      } else {
        await command.execute(interaction);
      }
    } catch (error) {
      console.error(error);
      errorEmbed.setDescription(`
      \`Command:\` ${interaction.commandName}.${subCommand || ""}
      \`Error:\` ${error.message}
      `);
      interaction.reply({
        embeds: [errorEmbed],
      });
    }
  },
};
