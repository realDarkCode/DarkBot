const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { loadEvents, loadCommands } = require("./Handlers");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
require("dotenv").config({});
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { connect } = require("mongoose");

connect(process.env.DATABASE_URI, {
  connectTimeoutMS: 10000,
})
  .then((connection) => {
    console.log("Connected to database:", connection.connection.name);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

client.commands = new Collection();
client.login(process.env.BOT_TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});
