const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  subCommand: "music.search",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client, member, guild, channel } = interaction;
    const query = interaction.options.getString("query", true);

    // Check if user is in a voice channel
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "❌ You need to be in a voice channel to search for music!"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check bot permissions
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has(["Connect", "Speak"])) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "❌ I need Connect and Speak permissions in your voice channel!"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      // Search for tracks
      const searchResult = await client.player.search(query, {
        requestedBy: member.user,
        searchEngine: "youtube", // Primary search engine
        fallbackSearchEngine: "soundcloud",
      });

      if (!searchResult || !searchResult.tracks.length) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`❌ No results found for: **${query}**`);
        return interaction.followUp({ embeds: [embed] });
      }

      // Get first 10 results
      const tracks = searchResult.tracks.slice(0, 10);

      // Create select menu options
      const options = tracks.map((track, index) => ({
        label:
          track.title.length > 100
            ? track.title.substring(0, 97) + "..."
            : track.title,
        description: `${track.author} • ${track.duration}`,
        value: index.toString(),
      }));

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("music_search_select")
        .setPlaceholder("Choose a track to play...")
        .addOptions(options);

      const row = new ActionRowBuilder().addComponents(selectMenu);

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: "Search Results",
          iconURL: member.user.avatarURL(),
        })
        .setDescription(
          `🔍 Found **${searchResult.tracks.length}** results for: **${query}**\n\nSelect a track from the menu below:`
        )
        .addFields({
          name: "Results",
          value: tracks
            .map(
              (track, index) =>
                `**${index + 1}.** [${track.title}](${track.url}) - ${
                  track.duration
                }`
            )
            .join("\n")
            .substring(0, 1024),
          inline: false,
        })
        .setFooter({ text: "You have 30 seconds to choose a track" })
        .setTimestamp();

      const response = await interaction.followUp({
        embeds: [embed],
        components: [row],
      });

      // Handle select menu interaction
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 30000,
        filter: (i) => i.user.id === member.user.id,
      });

      collector.on("collect", async (selectInteraction) => {
        await selectInteraction.deferUpdate();

        const selectedIndex = parseInt(selectInteraction.values[0]);
        const selectedTrack = tracks[selectedIndex];

        try {
          const { track } = await client.player.play(
            voiceChannel,
            selectedTrack,
            {
              nodeOptions: {
                metadata: {
                  channel: channel,
                  client: client,
                  requestedBy: member.user,
                  guild: guild, // Add guild for multi-server compatibility
                },
                leaveOnEnd: false,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 60000,
                selfDeaf: true,
                volume: 80,
                bufferingTimeout: 3000,
              },
              requestedBy: member.user,
              searchEngine: "youtube", // Primary search engine
            }
          );

          console.log(
            `🎵 Track selected and queued: ${track.title} by ${member.user.tag}`
          );

          const playEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `✅ **[${track.title}](${track.url})** has been added to the queue`
            )
            .setFooter({ text: `Requested by ${member.user.tag}` })
            .setTimestamp();

          await selectInteraction.editReply({
            embeds: [playEmbed],
            components: [],
          });
        } catch (error) {
          console.error("Search play error:", error);
          const errorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❌ An error occurred while trying to play the selected track:\n\`${error.message}\``
            );

          await selectInteraction.editReply({
            embeds: [errorEmbed],
            components: [],
          });
        }
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          const timeoutEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⏰ Search timed out! Please try again.");

          interaction
            .editReply({
              embeds: [timeoutEmbed],
              components: [],
            })
            .catch(console.error);
        }
      });
    } catch (error) {
      console.error("Search command error:", error);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `❌ An error occurred while searching:\n\`${error.message}\``
        );
      return interaction.followUp({ embeds: [embed] });
    }
  },
};
