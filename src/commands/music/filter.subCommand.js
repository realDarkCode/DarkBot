const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
    isValidMusicInteraction,
} = require("../../services/music/music.service");

const { filters: defaultFilters } = require("../../config/music");
module.exports = {
    subCommand: "music.filter",
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { client, options, member, channel } = interaction;

        const valid = await isValidMusicInteraction(interaction);

        if (!valid) return;

        const subCommand = interaction.options.getSubcommand(true);
        const filters = client.distube.getQueue(member.guild)?.filters;
        const filterName = options.getString("filter");

        switch (subCommand) {

            case "set": {

                const filter = defaultFilters.find(f => f.name === filterName)
                await filters.set([filter]);
                return await interaction.reply({
                    content: `Set \`${filter.name}\` filter to the queue`,
                });
                break;
            }

            case "clear": {
                await filters.clear();
                return await interaction.reply({
                    content: "All filters removed successfully",
                });
                break;
            }
            case "list": {
                const response = new EmbedBuilder().setTitle("List of available filters").setColor("Green");

                response.setDescription(defaultFilters.map(f => `\`${f.name}\` : \`${f.value}\``).join("\n"));
                return await interaction.reply({ embeds: [response] });


            }
            default:
                break;
        }

    },
};
