const { Schema, model } = require("mongoose");

const stringRequired = {
  type: String,
  required: true,
};
const memberLogSchema = new Schema(
  {
    guildId: {
      ...stringRequired,
      unique: true,
    },
    guildName: String,
    logChannelId: stringRequired,
    logChannelName: String,
    memberRoleId: stringRequired,
    botRoleId: stringRequired,
  },
  {
    timestamps: true,
  }
);

module.exports = model("memberLog", memberLogSchema);
