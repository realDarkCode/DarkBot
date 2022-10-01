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

const { eventHandler } = require("./handlers");

eventHandler(client);

// Login to the client
client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log(`Client logged in as ${client.user.tag}`);

    client.user.setActivity("with fire along with DarkCode");
  })
  .catch(console.error);
