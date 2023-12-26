const { Client, EmbedBuilder } = require("discord.js");
const subscriptionService = require("../services/subscription.service");
const catService = require("../services/cat.service");

const subTask = async (client) => {
  try {
    const usersToSent = await subscriptionService.getSubscriptionByService(
      "cat"
    );

    if (!usersToSent.length) return;

    const cat = await catService.getACat();
    const embed = new EmbedBuilder()
      .setColor("DarkBlue")
      .setTitle("Here is your cat!")
      .setDescription(`**Did you know?**\n*${cat.fact}*`)
      .setImage(cat.image?.url);

    await Promise.allSettled(
      usersToSent.map(async (u) => {
        const user = await client.users.fetch(u.userId);

        if (!user || user.bot) return;

        return await user.send({ embeds: [embed] });
      })
    );
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = {
  name: "catService",
  frequency: "0 22 * * *",
  /**
   * Sent a cat to subscribed users. [once in Every day 22:00-22:50 ]
   * @param {Client} client
   */
  async task(client) {
    const randomDelay = Math.floor(Math.random() * 50) * 60 * 1000;

    setTimeout(() => {
      subTask(client);
    }, randomDelay);
  },
  subTask,
};
