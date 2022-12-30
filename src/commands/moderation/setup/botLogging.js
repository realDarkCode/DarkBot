const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

const guildConfigDB = require("../../../schemas/guildConfig.schema");
module.exports = {
  subCommand: "setup.bot",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guildId, client, options } = interaction;

    // extract mentioned bot config
    const botLogChannelId = options.getChannel("log_channel").id;

    const botConfig = {
      botLogChannelId,
    };

    // update bot log channel id to the database
    await guildConfigDB.findOneAndUpdate({ guildId }, botConfig, {
      upsert: true,
    });

    // update to local cache
    const previousConfig = client.guildConfig.get(guildId);
    if (previousConfig)
      client.guildConfig.set(guildId, { ...previousConfig, ...botConfig });

    // response back to interaction.
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Bot Configuration Updated")
      .setDescription(
        [`- Bot Logging Channel: <#${botLogChannelId}>`].join("\n")
      );

    interaction.reply({ embeds: [embed] });
  },
};
