const { model, Schema } = require("mongoose");

module.exports = model(
  "Infraction",
  new Schema(
    {
      guildID: String,
      userID: String,
      guildName: String,
      userTag: String,
      infractions: Array,
    },
    {
      timestamps: true,
    }
  )
);
