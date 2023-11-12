const { model, Schema } = require("mongoose");

module.exports = model(
  "MusicCount",
  new Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      userName: String,
      guildId: {
        type: String,
        required: true,
      },
      songId: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      link: String,
      count: { type: Number, default: 0 },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  )
);
