const { Client, EmbedBuilder } = require("discord.js");
const notifyService = require("../services/tools/notify.service");
module.exports = {
  name: "notify-schedule",
  frequency: "15 */5 * * * *",
  /**
   *
   * @param {Client} client
   */
  async task(client) {
    try {
      const toNotifies = await notifyService.getNotificationToSend();
      const sendId = [];

      if (!toNotifies.length) return;

      await Promise.allSettled(
        toNotifies.map(async (notify) => {
          let recipient;
          const sender = await client.users.fetch(notify.userID);

          if (notify.recipientID) {
            recipient = await client.users.fetch(notify.recipientID);
          }
          if (!recipient) recipient = sender;

          if (!recipient) {
            return console.log(
              "User not found",
              notify.recipientID || notify.userID
            );
          }

          await recipient.createDM();

          const embed = new EmbedBuilder()
            .setColor("DarkOrange")
            .setTitle(`Message from ${notify.userTag || "Yourself"}`)
            .setAuthor({
              name: sender.displayName || notify.userTag,
              iconURL: sender.avatarURL(),
            })
            .setDescription(notify.message)
            .setTimestamp(notify.createdAt)
            .setFooter({
              text: notify.recipientID
                ? `This message was scheduled from ${notify.userTag} || /notify`
                : "This message is from your past self || /notify",
            });

          if (notify.image) embed.setImage(notify.image);

          await recipient.send({ embeds: [embed] });
          sendId.push(notify._id);
        })
      );

      await notifyService.updateNotifyStatusToTrue(sendId);
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
