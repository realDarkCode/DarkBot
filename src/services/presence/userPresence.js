const UserPresence = require("../../schemas/presence/presence.schema");

const updateUserPresence = ({
  userID,
  userName,
  guildID,
  guildName,
  status,
}) => {
  const data = {
    userID,
    userName,
    guildID,
    guildName,
  }
  return UserPresence.findOneAndUpdate(
    { userID },
    {
      $set: data,
      $push: {
        'status': {
          $each: [status],
          $slice: -6
        }
      }
    },
    {
      upsert: true,
      new: true,
    }
  );
};

const getAllUserPresence = (guildID) => {
  return UserPresence.find({ guildID });
};

const getAUserPresence = (guildID, userID) => {
  return UserPresence.findOne({ guildID, userID });
};

module.exports = {
  updateUserPresence,
  getAllUserPresence,
  getAUserPresence,
};
