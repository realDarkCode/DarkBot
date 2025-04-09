const { Schema, model } = require("mongoose");
const shortid = require("shortid");

const scheduleSchema = new Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  lastSend: { type: Date },
  repeat: { type: Boolean, default: false }, // true = repeat every week, false = send once
});

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
    schedule: [scheduleSchema],
    lastSend: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = model("alertMessage", alertMessageSchema);
