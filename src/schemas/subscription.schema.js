const { model, Schema } = require("mongoose");

const strReq = {
  type: String,
  required: true,
};

module.exports = model(
  "subscription",
  new Schema(
    {
      userId: strReq,
      userName: String,
      serviceName: {
        type: String,
        required: true,
        lowercase: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  )
);
