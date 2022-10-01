require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

// Initialize the client
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});
client.events = new Collection();
client.commands = new Collection();

// loading the handlers
const { loadEvents } = require("./handlers");
loadEvents(client);
// Login to the client
client.login(process.env.DISCORD_TOKEN);
