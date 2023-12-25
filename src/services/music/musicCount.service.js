const MusicCount = require("../../schemas/music/musicCount.schema");
const updateMusicCount = async ({
  userId,
  userName,
  guildId,
  songId,
  name,
  duration,
  link,
}) => {
  await MusicCount.findOneAndUpdate(
    { userId, guildId, songId },
    {
      userName,
      userId,
      guildId,
      songId,
      duration,
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

const getUserFavoriteMusic = async ({ userId, limit = 10 }) => {
  return await MusicCount.find({ userId }, { userId: 0, guildId: 0 })
    .sort({
      count: -1,
      createdAt: -1,
    })
    .limit(limit);
};

const dropCollection = () => {
  return MusicCount.deleteMany();
};

const getAllUserFavoriteMusic = async (limit = 25) => {
  let result = await MusicCount.aggregate([
    {
      $group: {
        _id: "$userId",
        totalUniqueSongsDuration: {
          $sum: "$duration",
        },
        totalSongs: {
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
        "songs.songId": 0,
        "songs.guildId": 0,
        "songs.userId": 0,
      },
    },
  ]);

  return result.map((u) => ({
    totalSongsDuration: u.songs.reduce(
      (store, current) => store + current.count * current.duration,
      0
    ),
    totalUniqueSongs: u.songs.length,
    ...u,

    songs: u.songs
      .sort((a, b) => {
        if (a.count < b.count) return 1;
        else if (a.count > b.count) return -1;
        else {
          if (a.createdAt < b.createdAt) return 1;
          else if (a.createdAt > b.createdAt) return -1;
          return 0;
        }
      })
      .slice(0, limit),
  }));
};
module.exports = {
  updateMusicCount,
  getUserFavoriteMusic,
  dropCollection,
  getAllUserFavoriteMusic,
};
