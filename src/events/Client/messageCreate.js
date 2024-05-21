
const { Client, Message } = require("discord.js");
const config = require("../../config/bot")
const {
    isValidMusicInteraction,
} = require("../../services/music/music.service");
module.exports = {
    name: "messageCreate",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     */
    async execute(client, message) {
        // Play music by just type the name of the music in specific channel 

        // validation 
        const { channelId, content, member, channel } = message
        if (channelId !== config.mainGuild.musicPlayerChannelId) return;


        if (member.user.bot) return;

        const isValidRequest = await isValidMusicInteraction(message, false)
        if (!isValidRequest) return;

        const query = (await message.fetch()).content
        // start playing music

        client.distube.play(member.voice.channel, query, {
            textChannel: channel,
            member: member,
        });

        await message.reply({ content: "🎼 Request Received" });





    },
};
