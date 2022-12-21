const memberLogDB = require("../schemas/memberLog.schema");

async function loadGuildMemberLogConfig(client) {
  (await memberLogDB.find()).forEach((doc) => {
    client.guildConfig.set(doc.guildId, {
      logChannelId: doc.logChannelId,
      memberRoleId: doc.memberRoleId,
      botRoleId: doc.botRoleId,
    });
  });
}

module.exports = { loadGuildMemberLogConfig };
