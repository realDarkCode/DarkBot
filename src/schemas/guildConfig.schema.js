const { Schema, model } = require("mongoose");

const guildConfigSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
    },
    guildName: String,
    memberLogChannelId: String,
    memberLogChannelName: String,
    botLogChannelId: String,
    botLogChannelName: String,
    memberRoleId: String,
    botRoleId: String,
    monitor: {
      announceChannelId: String,
      announceChannelName: String,
      adminRoleId: String,
      adminRoleName: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("guildConfig", guildConfigSchema);
