const { Schema, model } = require("mongoose");
const {
  classList,
  sectionList,
  houseList,
  bloodGroupList,
} = require("../config/NDT.config.js");

const defaultOption = {
  type: String,
};

const disciplineMonitorSchema = new Schema(
  {
    school_id: {
      ...defaultOption,
      required: true,
      unique: true,
    },
    status: {
      ...defaultOption,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    name: { ...defaultOption, required: true },
    class: {
      ...defaultOption,
      enum: [...classList],
      required: true,
    },
    gender: {
      ...defaultOption,
      enum: ["male", "female"],
    },
    contact: {
      ...defaultOption,
    },
    section: {
      ...defaultOption,
      enum: [...sectionList],
    },
    house: {
      ...defaultOption,
      enum: [...houseList],
    },
    blood_group: {
      ...defaultOption,
      enum: [...bloodGroupList],
    },
    date_of_birth: {
      ...defaultOption,
    },
  },
  {
    timestamps: true,
  }
);

const DisciplineMonitor = model("DisciplineMonitor", disciplineMonitorSchema);

module.exports = DisciplineMonitor;
