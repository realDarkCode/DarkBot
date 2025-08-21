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
    // Handle autocomplete interactions
    if (interaction.isAutocomplete()) {
      // Handle music command autocomplete specifically - only for play subcommand
      if (interaction.commandName === "music") {
        const subcommand = interaction.options.getSubcommand();
        const focusedOption = interaction.options.getFocused(true);

        // Only provide autocomplete for the 'play' subcommand
        if (subcommand === "play" && focusedOption.name === "query") {
          const query = focusedOption.value;

          // Don't search if query is too short
          if (query.length < 2) {
            return interaction.respond([]);
          }

          // If it's a URL, just return it as is
          if (query.startsWith("http")) {
            return interaction.respond([
              { name: "Use the provided URL", value: query },
            ]);
          }

          try {
            // Add timeout to prevent long searches
            const searchPromise = client.player.search(query, {
              searchEngine: "youtube", // Primary: YouTube
              fallbackSearchEngine: "spotify", // Secondary: Spotify
            });

            // Timeout after 2 seconds to prevent blocking
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Search timeout")), 2000)
            );

            const searchResult = await Promise.race([
              searchPromise,
              timeoutPromise,
            ]);

            if (!searchResult || !searchResult.tracks.length) {
              return interaction.respond([
                { name: `No results found for "${query}"`, value: query },
              ]);
            }

            // Format the results for Discord autocomplete (max 25 choices)
            const choices = searchResult.tracks.slice(0, 10).map((track) => {
              let name = `${track.title} - ${track.author}`;
              let duration = track.duration ? ` (${track.duration})` : "";

              // Truncate if too long (Discord limit is 100 characters)
              let fullName = name + duration;
              if (fullName.length > 100) {
                name = name.substring(0, 95 - duration.length) + "...";
                fullName = name + duration;
              }

              return {
                name: fullName,
                value: track.url || track.title,
              };
            });

            return interaction.respond(choices);
          } catch (error) {
            console.error("🎵 Autocomplete search error:", error.message);
            // Return the original query as fallback
            return interaction.respond([
              { name: `Search for "${query}"`, value: query },
            ]);
          }
        }
        return;
      }

      // Handle other command autocompetes
      const command = client.commands.get(interaction.commandName);
      if (!command || !command.autocomplete) return;

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error("Autocomplete error:", error);
      }
      return;
    }

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
    if (
      command.requiredRole &&
      !interaction.member.roles.cache.some(
        (role) => command.requiredRole === role.id
      )
    ) {
      return interaction.reply({
        content: `You need <@&${command.requiredRole}> role to use this command`,
        ephemeral: true,
      });
    }
    const subCommand =
      interaction.options.getSubcommandGroup() ||
      interaction.options.getSubcommand(false);
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
      interaction.channel.send({
        embeds: [errorEmbed],
      });
    }
  },
};
