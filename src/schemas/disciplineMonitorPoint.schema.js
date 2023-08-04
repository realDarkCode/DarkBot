const { Schema, Types, model } = require("mongoose");

const disciplineMonitorPointSchema = new Schema(
  {
    point: {
      type: Number,
      default: 0,
    },
    school_id: {
      type: String,
    },
    member: {
      type: Types.ObjectId,
      required: true,
      ref: "DisciplineMonitor",
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const DisciplineMonitorPoint = model(
  "DisciplineMonitorPoint",
  disciplineMonitorPointSchema
);

module.exports = DisciplineMonitorPoint;
