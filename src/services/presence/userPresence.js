const UserPresence = require("../../schemas/presence/presence.schema");

const updateUserPresence = ({
  userID,
  userName,
  guildID,
  guildName,
  status,
}) => {
  return UserPresence.findOneAndUpdate(
    { userID },
    {
      userID,
      userName,
      status,
      guildID,
      guildName,
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
