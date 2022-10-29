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
  partials: [Message, ThreadMember],
});

client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.color = "#1975FC";

// Establish connection to Database
const { connect } = require("mongoose");
connect(process.env.DATABASE_URI, {
  connectTimeoutMS: 10000,
})
  .then((connection) => {
    console.log(`Connected to database: ${connection.connection.name}`);
  })
  .catch((err) => {
    console.log(err);
    console.log("⚠️ Failed to establish connection to database. exiting...");
    process.exit(1);
  });

// loading the handlers
const { loadEvents } = require("./handlers");
loadEvents(client);

// Login to the client
client.login(process.env.DISCORD_TOKEN);
