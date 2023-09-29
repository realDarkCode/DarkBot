const { model, Schema } = require("mongoose");

module.exports = model(
  "presence",
  new Schema(
    {
      userID: {
        type: String,
        required: true,
        unique: true,
      },
      userName: String,
      guildID: {
        type: String,
        required: true,
      },
      guildName: String,
      status: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  )
);
