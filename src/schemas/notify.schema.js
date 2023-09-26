const { model, Schema } = require("mongoose");

const strReq = {
  type: String,
  required: true,
};
module.exports = model(
  "notify",
  new Schema(
    {
      userID: strReq,
      userTag: String,
      recipientID: {
        type: String,
      },
      message: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        required: true,
      },
      hasSend: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
);
