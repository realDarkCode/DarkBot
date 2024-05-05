const { model, Schema } = require("mongoose");


const status = new Schema({
  text: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
})


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
      status: [status]
    },
    {
      timestamps: true,
      versionKey: false,
    }
  )
);
