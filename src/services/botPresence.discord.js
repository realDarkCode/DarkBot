const { Client, ActivityType } = require("discord.js");
const { timestampToRelativeTime } = require("../helpers/convert");
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

const getRunningTime = (createdAt) => {
  const d = new Date();
  d.setMilliseconds(d.getMilliseconds() - createdAt);
  return timestampToRelativeTime(Date.now(), d);
};

const getRandomActivity = () => {
  return activities[Math.floor(Math.random() * activities.length)];
};

async function updateRuntimeStatus(client) {
  async function _() {
    await client.user.setPresence({
      status: "online",
      activities: [
        {
          ...getRandomActivity(),
          state: `for ${getRunningTime(client.uptime)}`,
        },
      ],
    });
  }

  _();
  if (client.activityIntervalId) return;
  client.activityIntervalId = setInterval(async () => {
    await _();
  }, 1000 * 60 * 45);
}

async function updateMusicStatus(queue) {
  clearInterval(queue.client.activityIntervalId);
  const song = queue.songs[0];
  let state = `${queue.previousSongs.length + 1}/${
    queue.songs.length + queue.previousSongs.length
  } - ${song.name.slice(0, 25)}. ⏲${getRunningTime(queue.client.uptime)}`;

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
