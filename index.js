const { Client } = require("discord.js");
require("dotenv").config({});
const client = new Client({ intents: ["Guilds"] });

client.login(process.env.BOT_TOKEN).then(() => {
  console.log(`Bot logged in as ${client.user.username}`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} guild(s)`);
});
