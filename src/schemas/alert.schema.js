const { Schema, model } = require("mongoose");
const shortid = require("shortid");

const alertMessageSchema = new Schema(
  {
    shortId: {
      type: String,
      default: shortid.generate,
      unique: true,
    },
    guildId: { type: String, required: true },

    channelId: { type: String, required: true },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    schedule: [{ day: String, time: String }],
    lastSend: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = model("alertMessage", alertMessageSchema);
