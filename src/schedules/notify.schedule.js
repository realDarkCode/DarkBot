const { Client, EmbedBuilder } = require("discord.js");
const notifyService = require("../services/tools/notify.service");
module.exports = {
  name: "notify-schedule",
  frequency: "*/5 * * * * *",
  /**
   *
   * @param {Client} client
   */
  async task(client) {
    try {
      const toNotifies = await notifyService.getNotificationToSend();
      const sendId = [];

      if (!toNotifies.length) return;

      await Promise.all(
        toNotifies.map(async (notify) => {
          const user =
            client.users.cache.get(notify.recipientID) ||
            client.users.cache.get(notify.userID);

          if (!user) return;

          await user.createDM();

          const embed = new EmbedBuilder()
            .setTitle("Notification")
            .setColor("Blue")
            .setDescription(notify.message)
            .setFooter({
              text: `Notify from ${
                notify.userTag
              } at ${notify.time.toLocaleTimeString()}`,
            });

          await user.send({ embeds: [embed] });
          sendId.push(notify.id);
        })
      );

      await notifyService.updateNotifyStatusToTrue(sendId);
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
