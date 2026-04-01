const { Client, EmbedBuilder } = require("discord.js");
const subscriptionService = require("../services/subscription.service");
const quotes = require("../config/quotes.json");

module.exports = {
  name: "hscReminder",
  // frequency: "*/10 * * * * *", // for testing
  frequency: "4 0 */6 * * *", // Every 6 hours at 4 minutes past the hour
  /**
   * @param {Client} client
   */
  async task(client) {
    try {
      // Add randomization to avoid sending at exactly the same time
      const randomDelay = Math.floor(Math.random() * 1654) * 1000;
      // const randomDelay = 0; // for testing

      setTimeout(async () => {
        await sendHscReminders(client);
      }, randomDelay);
    } catch (error) {
      console.log("Error in HSC reminder schedule:", error);
    }
  },
};

async function sendHscReminders(client) {
  try {
    const subscribers = await subscriptionService.find({
      serviceName: "hsc",
      isActive: true,
    });

    if (!subscribers.length) return;

    console.log(`Sending HSC reminders to ${subscribers.length} subscribers`);

    // HSC exam date
    const examDate = new Date("2026-06-01T00:00:00");
    const currentDate = new Date();
    const timeDiff = examDate.getTime() - currentDate.getTime();

    if (timeDiff <= 0) return;

    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    const totalDurationDays = Math.ceil(
      (examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysPassed = totalDurationDays - daysLeft;

    const elapsedPercentage = Math.min(
      Math.max(((daysPassed / totalDurationDays) * 100).toFixed(2), 0),
      100,
    );

    const dailyQuote = getRandomQuote(quotes.hsc);
    const embedColor = getColorByDaysLeft(daysLeft);

    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        try {
          const user = await client.users.fetch(subscriber.userId);
          if (!user) return;

          await user.createDM();

          const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("🚨 HSC Reminder")
            .setDescription(
              `হ্যালো ${user.displayName || user.username}! 👀\n\n তোমার মনযোগ কোথায়? তোমার হাতে কিন্তু আর একদমই সময় নেই, প্রিপারেশন শেষ করার জন্য ঘড়ির কাঁটা টিকটিক করছে! এখনই ব্যাক করো।`,
            )
            .setImage(
              "https://i.pinimg.com/736x/ae/79/8b/ae798bd2e7ca5045e523a514bad37912.jpg",
            )
            .addFields(
              {
                name: "⏳ সময় আছে মাত্র:",
                value: `${daysLeft} দিন, ${hoursLeft} ঘণ্টা, ${minutesLeft} মিনিট`,
                inline: true,
              },
              {
                name: "📅 সময় অতিবাহিত হয়েছে:",
                value: `${elapsedPercentage}%`,
                inline: true,
              },
              {
                name: "📅 প্রিপারেশন শেষ করার সর্বশেষ   তারিখ:",
                value: `<t:${Math.floor(examDate.getTime() / 1000)}:D>`,
                inline: false,
              },
            )
            .setFooter({
              text: `বইটা খোলো, ক্যারিয়ার গড়ো! • রিমাইন্ডার বন্ধ করতে: /subscription unsubscribe`,
            })
            .setTimestamp();

          await user.send({
            content: `${dailyQuote}`,
            embeds: [embed],
          });

          console.log(`Sent HSC reminder to ${user.username}`);
        } catch (userError) {
          console.log(
            `Failed to send reminder to user ${subscriber.userId}:`,
            userError.message,
          );
        }
      }),
    );

    const successful = results.filter(
      (result) => result.status === "fulfilled",
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected",
    ).length;

    console.log(`HSC reminder summary: ${successful} sent, ${failed} failed`);
  } catch (error) {
    console.log("Error sending HSC reminders:", error);
  }
}

function getColorByDaysLeft(daysLeft) {
  if (daysLeft <= 7) return "#FF0000"; // Bright Red - Critical
  if (daysLeft <= 15) return "#FF4444"; // Red - Urgent
  if (daysLeft <= 30) return "#FF8C00"; // Orange - Warning
  if (daysLeft <= 45) return "#FFD700"; // Gold - Getting close
  if (daysLeft <= 60) return "#32CD32"; // Lime Green
  return "#00FF00"; // Bright Green
}

function getRandomQuote(quotesArray) {
  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  return quotesArray[randomIndex];
}
