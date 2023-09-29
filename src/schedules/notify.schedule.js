const { Client, EmbedBuilder } = require("discord.js");
const notifyService = require("../services/tools/notify.service");
module.exports = {
  name: "notify-schedule",
  frequency: "*/5 * * * *",
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
          let user;
          if (notify.recipientID) {
            user = await client.users.fetch(notify.recipientID);
          }
          if (!user) user = await client.users.fetch(notify.userID);

          if (!user) {
            return console.log(
              "User not found",
              notify.recipientID || notify.userID
            );
          }

          await user.createDM();

          const embed = new EmbedBuilder()
            .setTitle("Notification")
            .setColor("Blue")
            .setDescription(
              (notify.message += `\nMessage from ${
                notify.userTag
              } scheduled <t:${Math.round(notify.time / 1000)}:R>`)
            )
            .setFooter({
              text: "This message is from the past",
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
