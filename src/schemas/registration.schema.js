const { Schema, model } = require("mongoose");

const eventRegistrationSchema = new Schema(
  {
    active: { type: Boolean, default: true },
    messageId: { type: String, required: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    participants: { type: [String], default: [] },
    reservists: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = model("EventRegistration", eventRegistrationSchema);
