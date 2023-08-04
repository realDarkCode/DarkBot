const { Schema, Types, model } = require("mongoose");

const disciplineMonitorPointSchema = new Schema(
  {
    point: {
      type: Number,
      default: 0,
    },
    member: {
      type: Types.ObjectId,
      required: true,
      ref: "DisciplineMonitor",
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
