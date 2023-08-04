const { Schema, model, Types } = require("mongoose");

const disciplineMonitorPointHistorySchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    member: {
      type: Types.ObjectId,
      required: true,
      ref: "DisciplineMonitor",
    },
    point: {
      type: Number,
      required: true,
      min: -15,
      max: 15,
    },
    reason: {
      type: String,
    },
    moderateBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DisciplineMonitorPoint = model(
  "DisciplineMonitorPointHistory",
  disciplineMonitorPointHistorySchema
);

module.exports = DisciplineMonitorPoint;
