const guildConfigDB = require("../schemas/guildConfig.schema");

async function loadGuildConfig(client) {
  (await guildConfigDB.find()).forEach((doc) => {
    client.guildConfig.set(doc.guildId, doc.toObject());
  });
}

module.exports = { loadGuildConfig };
