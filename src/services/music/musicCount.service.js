const MusicCount = require("../../schemas/music/musicCount.schema");
const { DisTube } = require("distube");
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

const getUserFavoriteMusic = async ({ userId, limit = 15 }) => {
  return await MusicCount.find({ userId }, { userId: 0, guildId: 0 })
    .sort({
      count: -1,
      updatedAt: -1,
    })
    .limit(limit);
};

const dropCollection = () => {
  return MusicCount.deleteMany();
};

const getAllUserFavoriteMusic = async (limit = 15) => {
  let result = await MusicCount.aggregate([
    {
      $group: {
        _id: "$userId",
        totalSongsCount: {
          $sum: "$count",
        },
        songs: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $project: {
        "songs._id": 0,
      },
    },
  ]);

  return result.map((u) => ({
    ...u,
    songs: u.songs
      .sort((a, b) => b.count - a.count)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit),
  }));
};
module.exports = {
  updateMusicCount,
  getUserFavoriteMusic,
  dropCollection,
  getAllUserFavoriteMusic,
};
