const { Client, VoiceState } = require("discord.js");

let leaveTimerId = null;

const EMPTY_TIMEOUT = 1000 * 60 * 10; // 10 minute


const leaveVoiceChannelAfterTimeout = (client, oldState) => {
    leaveTimerId = setTimeout(() => {
        const voice = oldState.guild.members.cache.get(client.user.id)?.voice;
        voice.disconnect();
        leaveTimerId = null;
    }, EMPTY_TIMEOUT);
}
const clearLeaveTimeout = () => {
    if (leaveTimerId) {

        clearTimeout(leaveTimerId);
        leaveTimerId = null;
    }
}

module.exports = {
    name: "voiceStateUpdate",
    /**
     *
     * @param {Client} client
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    async execute(client, oldState, newState) {
        // Check if the bot is in a channel
        if (oldState.channel) {
            const queue = client.distube.getQueue(oldState.guild);
            // If the bot is alone in the channel, initiate leave timeout and pause the queue
            if (oldState.channel.members.size === 1) {
                leaveVoiceChannelAfterTimeout(client, oldState);
                if (queue?.playing) queue.pause();
            }
        }

        // If the bot is not alone in the new state, clear the leave timeout and resume the queue
        if (newState.channel && newState.channel.members.size > 1) {
            clearLeaveTimeout();
            const queue = client.distube.getQueue(newState.guild);
            if (queue?.paused) queue.resume();
        }
    },
};