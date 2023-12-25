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
      serviceName: strReq,
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
