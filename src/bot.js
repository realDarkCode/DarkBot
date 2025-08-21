require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const fs = require("fs");
// load guild config
const { loadGuildConfig } = require("./functions/loadConfig");
// Initialize music player
const { Player } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");
const {
  SpotifyExtractor,
  SoundCloudExtractor,
  AppleMusicExtractor,
} = require("@discord-player/extractor");
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

// Initialize music player
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
  skipFFmpeg: false, // Ensure FFmpeg is used
});

// Register extractors
async function initializeMusicExtractors() {
  try {
    await client.player.extractors.register(YoutubeiExtractor, {
      authentication: process.env.YOUTUBE_COOKIE, // Optional: for better rate limits
      overrideExistingRegistration: true,
    });
    await client.player.extractors.register(SpotifyExtractor, {});
    await client.player.extractors.register(SoundCloudExtractor, {});
    await client.player.extractors.register(AppleMusicExtractor, {});
    console.log("🎵 Music extractors loaded successfully");
  } catch (error) {
    console.error("❌ Failed to load music extractors:", error);
  }
}

// Initialize extractors
initializeMusicExtractors();

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

// Load systems after client is ready - this will be done in ready event
module.exports = client;
