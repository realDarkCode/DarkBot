const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const os = require("os");
const { connection } = require("mongoose");

const { EmbedBuilder } = require("@discordjs/builders");

function dbStatusCodeToStatus(statusCode) {
  let status = "";
  switch (statusCode) {
    case 0:
      status = `🔴 DISCONNECTED`;
      break;
    case 1:
      status = `🟢 CONNECTED`;
      break;
    case 2:
      status = `🟡 CONNECTING`;
      break;
    case 3:
      status = `🟠 DISCONNECTING`;
    default:
      status = `🟣 UNKNOWN`;
      break;
  }
  return status;
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Show the status of the bot."),

  developerOnly: true,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client } = interaction;

    const Response = new EmbedBuilder()
      .setTitle("🤖 Bot Status")
      //   .setColor("Blue")
      .setDescription(
        "A discord bot designed to serve DarkCode's community discord."
      )
      .setImage(client.user.avatarURL())
      .setFields(
        { name: "👩🏻‍🔧 Client", value: client.user.tag, inline: true },
        {
          name: "📆 Created",
          value: `<t:${parseInt(
            client.application.createdTimestamp / 1000
          )}:R>`,
          inline: true,
        },
        {
          name: "✅ Verified",
          value: client.user.verified ? "Yes" : "No",
          inline: true,
        },
        {
          name: "👩🏻‍💻 Owner",
          value: client.application?.owner || "DarkCode#4733",
          inline: true,
        },
        {
          name: "📚 Database",
          value: dbStatusCodeToStatus(connection.readyState),
          inline: true,
        },
        { name: "🖥 System", value: process.platform, inline: true },
        { name: "🧠 CPU Model", value: os.cpus()[0].model, inline: true },
        {
          name: "👨‍🔧 Node Version",
          value: process.version,
          inline: true,
        },
        {
          name: "🛠 Discord.js Version",
          value: require("discord.js").version,
          inline: true,
        },
        {
          name: "⚡ Total Memory",
          value: Math.round(os.totalmem() / 1024 / 1024).toString(),
          inline: true,
        },
        {
          name: "⏺ Memory Usages",
          value: Math.round(os.freemem() / 1024 / 1024).toString(),
          inline: true,
        },
        {
          name: "⏰ Uptime",
          value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "🏓 Ping",
          value: `${Math.round(interaction.client.ws.ping)}ms`,
          inline: true,
        },
        {
          name: "🌎 Guilds",
          value: client.guilds.cache.size.toString(),
          inline: true,
        },
        {
          name: "🤖 Commands",
          value: interaction.guild.commands.cache.size.toString(),
          inline: true,
        },
        {
          name: "👥 Users",
          value: client.users.cache.size.toString(),
          inline: true,
        },
        {
          name: "💬 Text channels",
          value: client.channels.cache.size.toString(),
          inline: true,
        },
        {
          name: "🎤 Voice channels",
          value: client.voice.adapters.size.toString(),
          inline: true,
        }
      );
    await interaction.reply({ embeds: [Response] });
  },
};
