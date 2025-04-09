const { Client } = require("discord.js");
const AlertMessage = require("../schemas/alert.schema.js");

module.exports = {
  name: "alert",
  frequency: "10 */5 * * * *",
  /**
   * @param {Client} client
   */
  async task(client) {
    try {
      const nowUTC = new Date();

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const todayUTC = days[nowUTC.getUTCDay()];
      const currentTimeUTC = nowUTC.toISOString().slice(11, 16); // "HH:mm"

      const alerts = await AlertMessage.find({
        "schedule.day": todayUTC,
      });

      for (const alert of alerts) {
        let isUpdated = false;

        // Filter out schedules we might remove later if non-repeating
        let schedulesToRemove = [];

        for (let sched of alert.schedule) {
          if (sched.day !== todayUTC) continue;

          const schedTime = sched.time.padStart(5, "0");

          const scheduleDateTimeUTC = new Date(
            `${nowUTC.toISOString().slice(0, 10)}T${schedTime}:00.000Z`
          );

          const graceWindowStart = new Date(nowUTC.getTime() - 5 * 60 * 1000);

          const lastSend = sched.lastSend || new Date(0);

          if (
            lastSend < scheduleDateTimeUTC &&
            scheduleDateTimeUTC >= graceWindowStart &&
            scheduleDateTimeUTC <= nowUTC
          ) {
            const channel = await client.channels.fetch(alert.channelId);
            if (channel) {
              await channel.send(alert.message);

              sched.lastSend = nowUTC;
              isUpdated = true;

              if (!sched.repeat) {
                schedulesToRemove.push(sched._id); // queue for removal
              }
            }
          }
        }

        // Remove non-repeating schedules that have been sent
        if (schedulesToRemove.length > 0) {
          alert.schedule = alert.schedule.filter(
            (sched) => !schedulesToRemove.includes(sched._id)
          );
          isUpdated = true;
        }

        if (isUpdated) {
          await alert.save();
        }
      }
    } catch (error) {
      console.error("Alert job error:", error);
    }
  },
};
