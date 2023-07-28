const DisciplineMonitor = require("../schemas/disciplineMonitor.schema.js");
const DisciplineMonitorPoint = require("../schemas/disciplineMonitorPoint.schema.js");

const findMonitorById = async (id) => {
  return DisciplineMonitor.findOne({ school_id: id });
};

const addMonitor = async (id, name, cls) => {
  const monitor = await findMonitorById(id);
  if (monitor)
    throw new Error("Monitor already exists with localId: " + localId);
  const newMonitor = new DisciplineMonitor({
    school_id: id,
    name,
    class: cls,
  });
  return await newMonitor.save();
};

const updateMonitorInfo = async (id, updatedData) => {
  const monitor = await findMonitorById(id);
  if (!monitor) throw new Error("Monitor not found with localId: " + localId);
  const {
    contact,
    section,
    house,
    bloodGroup,
    dateOfBirth,
    cls,
    gender,
    status,
    name,
  } = updatedData;
  return await DisciplineMonitor.findByIdAndUpdate(
    member._id,
    {
      contact,
      gender,
      section,
      house,
      blood_group: bloodGroup,
      date_of_birth: dateOfBirth,
      class: cls,
      status,
      name,
    },
    { upsert: true, new: true }
  );
};
const getMonitorList = async (filter = { class: "seven" }) => {
  const { class: cls } = filter;
  return await DisciplineMonitor.find({ class: cls });
};
module.exports = {
  addMonitor,
  updateMonitorInfo,
  getMonitorList,
  findMonitorById,
};
