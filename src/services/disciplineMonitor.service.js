const DisciplineMonitor = require("../schemas/disciplineMonitor.schema.js");

const { getPoint } = require("./disciplineMonitorPoint.service.js");
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

const defaultQuery = {
  class: "seven",
};
const getMonitorListWithPoints = async (query = {}) => {
  const _query = { ...defaultQuery, ...query };
  const monitorList = await getMonitorList(_query);
  const monitorListWithPoint = await Promise.all(
    monitorList.map(async (monitor) => {
      const point = await getPoint(monitor._id);
      return {
        point,
        name: monitor.name,
        school_id: monitor.school_id,
        class: monitor.class,
      };
    })
  );
  return monitorListWithPoint;
};
module.exports = {
  addMonitor,
  updateMonitorInfo,
  getMonitorList,
  findMonitorById,
  getMonitorListWithPoints,
};
