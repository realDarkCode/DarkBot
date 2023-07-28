const { Schema, model, Types } = require("mongoose");

const disciplineMonitorPointSchema = new Schema(
  {
    member: {
      type: String,
      required: true,
      ref: "DisciplineMonitor",
    },
    point: {
      type: Number,
      required: true,
      min: 1,
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
  "DisciplineMonitorPoint",
  disciplineMonitorPointSchema
);

module.exports = DisciplineMonitorPoint;
