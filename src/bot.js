require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
// load guild config
const { loadGuildConfig } = require("./functions/loadConfig");
// Initialize the client
const {
  Guilds,
  GuildMembers,
  GuildMessages,
  GuildVoiceStates,
  GuildPresences,
} = GatewayIntentBits;
const { Message, ThreadMember } = Partials;
const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildVoiceStates,
    GuildPresences,
  ],
  partials: [Message, ThreadMember],
});

client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.components = new Collection();
client.guildConfig = new Collection();
client.color = "#1975FC";
client.activityIntervalId = null;
client.musicControllerMsgId = null;

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
client.distube = new DisTube(client, {
  emptyCooldown: 5 * 60,
  plugins: [new SpotifyPlugin(), new YtDlpPlugin()],
});
// Establish connection to Database
const { connect, set: mongooseSet } = require("mongoose");
mongooseSet("strictQuery", false);
connect(process.env.DATABASE_URI, {
  connectTimeoutMS: 10000,
})
  .then((connection) => {
    console.log(`Connected to database: ${connection.connection.name}`);

    loadGuildConfig(client);
  })
  .catch((err) => {
    console.log(err);
    console.log("⚠️ Failed to establish connection to database. exiting...");
    process.exit(1);
  });

// loading the handlers
const { loadEvents } = require("./handlers");
loadEvents(client);

module.exports = client;
