const { Presence, client } = require("discord.js");

const userPresenceService = require("../../services/presence/userPresence");
module.exports = {
  name: "presenceUpdate",
  /**
   *
   * @param {client} client
   * @param {Presence} previousPresence
   * @param {Presence} updatedPresence
   */
  async execute(_client, _previousPresence, updatedPresence) {
    if (updatedPresence.user.bot) return;
    const { guild, user, status, userId } = updatedPresence;

    await userPresenceService.updateUserPresence({
      guildID: guild.id,
      guildName: guild.name,
      userID: userId,
      userName: user.username,
      status,
    });
  },
};
