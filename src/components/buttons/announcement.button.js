const { ButtonInteraction } = require("discord.js");

module.exports = {
  data: {
    name: "announcement",
  },
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { buttonInfo, client, message, guildId, user } = interaction;

    const operation = buttonInfo[0];
    const userId = buttonInfo[1];
    const channelId = buttonInfo[2];

    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      return await interaction.reply({
        content: "❌ the channel is not found. please try again",
      });
    }

    if (userId !== user.id) {
      return await interaction.reply({
        content: "❌ you can't cancel/confirm others announcement.",
      });
    }

    if (operation === "confirm") {
      const msg = await channel.send(
        { content: message.content, embeds: message.embeds },
        { fetch: true }
      );
      if (
        channelId == client.guildConfig?.get(guildId)?.announcementChannelId
      ) {
        msg.react("🎉");
        msg.react("❤");
        msg.react("👎");
        msg.react("😆");
        msg.react("😮");
        msg.react("😢");
        msg.react("😠");
      }
    }

    return await message.delete();
  },
};
