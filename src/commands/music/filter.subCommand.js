const { ChatInputCommandInteraction } = require("discord.js");
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
            case "add": {
                if (filters.values.includes(filterName)) {
                    return await interaction.reply({
                        content: "❌ Filter already added",
                    });
                }
                const filter = defaultFilters.find(f => f.name === filterName)
                await filters.add(filter);

                return await interaction.reply({
                    content: `Added \`${filter.name}\` filter to the queue`,
                });

                break;
            }
            case "set": {

                const filter = defaultFilters.find(f => f.name === filterName)
                await filters.set([filter]);
                return await interaction.reply({
                    content: `Set \`${filter.name}\` filter to the queue`,
                });
                break;
            }
            case "remove": {

                if (!filters.values.includes(filterName)) {
                    return await interaction.reply({
                        content: "❌ Filter not found",
                    });
                }
                const filter = defaultFilters.find(f => f.name === filterName)
                await filters.remove(filter);
                return await interaction.reply({
                    content: `Removed \`${filter.name}\` filter from the queue`,
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
                const list = filters.values.map(f => `\`${f.name}\``).join(", ");
                return await interaction.reply({
                    content: `List of active Filters: ${list}`,
                });
                break;
            }
            default:
                break;
        }


        console.log(queue.filters.values)
        await interaction.reply({ content: "🎼 Request Received" });
    },
};
