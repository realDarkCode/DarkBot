require("dotenv").config();
const client = require("./src/bot");

// Login to the client
client.login(process.env.DISCORD_TOKEN);
