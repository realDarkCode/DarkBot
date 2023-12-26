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

    const announcementChannelId =
      client?.guildConfig.get(guildId).announcementChannelId;

    if (!announcementChannelId) {
      return await interaction.reply({
        content:
          "❌ You sever has no announcement channel configured. Please configure first",
      });
    }

    const channel = await client.channels.fetch(announcementChannelId);
    if (!channel) {
      return await interaction.reply({
        content:
          "❌ your announcement channel is not found. please reconfigure",
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

      msg.react("🎉");
      msg.react("❤");
      msg.react("👎");
      msg.react("😆");
      msg.react("😮");
      msg.react("😢");
      msg.react("😠");
    }

    return await message.delete();
  },
};
