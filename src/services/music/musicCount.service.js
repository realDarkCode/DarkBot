const MusicCount = require("../../schemas/music/musicCount.schema");

const updateMusicCount = async ({
  userId,
  userName,
  guildId,
  songId,
  name,
  link,
}) => {
  await MusicCount.findOneAndUpdate(
    { userId, guildId, songId },
    {
      userName,
      userId,
      guildId,
      songId,
      name,
      link,
      $inc: {
        count: 1,
      },
    },
    {
      upsert: true,
    }
  );
};

const topMusic = async ({ userId, limit = 10 }) => {
  return await MusicCount.find({ userId }, { userId: 0, guildId: 0 })
    .sort({
      count: -1,
    })
    .limit(limit);
};

module.exports = {
  updateMusicCount,
  topMusic,
};
