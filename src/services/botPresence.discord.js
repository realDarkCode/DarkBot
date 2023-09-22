const { Client, ActivityType } = require("discord.js");
const { timestampToRelativeTime } = require("../helpers/convert");
const { resetPlayer } = require("../helpers/music.helper");
/**
 *
 * @param {Client} client
 */

const activities = [
  {
    name: "server! 😎",
    type: ActivityType.Watching,
  },
  {
    name: "blue sky! ☁",
    type: ActivityType.Watching,
  },
  {
    name: "catnap contest 😿",
    type: ActivityType.Competing,
  },
  {
    name: "cat's life! 🐈",
    type: ActivityType.Streaming,
  },
  {
    name: "with an owl! 🦉",
    type: ActivityType.Playing,
  },
  {
    name: "to ruby! 🐥",
    type: ActivityType.Listening,
  },
];

async function updateRuntimeStatus(client) {
  resetPlayer({ client });
  async function _() {
    const d = new Date();
    d.setMilliseconds(d.getMilliseconds() - client.uptime);
    await client.user.setPresence({
      status: "online",
      activities: [
        {
          ...activities[Math.floor(Math.random() * activities.length)],
          state: `for ${timestampToRelativeTime(Date.now(), d)}`,
        },
      ],
    });
  }

  _();
  client.activityIntervalId = setInterval(async () => {
    _();
  }, 1000 * 60 * 123);
}

async function updateMusicStatus(queue) {
  state = `
      1/${queue.songs.length} - ${queue.formattedDuration} - ${queue.songs[0].name}
      `;

  await queue.client.user.setPresence({
    status: "online",
    activities: [
      {
        type: ActivityType.Playing,
        name: "music! 🎵",
        state,
      },
    ],
  });
}
module.exports = {
  updateRuntimeStatus,
  updateMusicStatus,
};
