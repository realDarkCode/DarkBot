const DisciplineMonitor = require("../schemas/disciplineMonitor.schema.js");

const { getPoint } = require("./disciplineMonitorPoint.service.js");
const findMonitorById = async (id, cls) => {
  const query = {};
  if (id) query.school_id = { $regex: `${id}$` };
  if (cls) query.class = cls;

  return DisciplineMonitor.findOne({
    ...query,
  });
};

const addMonitor = async (id, name, cls) => {
  const monitor = await findMonitorById(id, cls);
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

  const updatedObject = {};

  Object.keys(updatedData).forEach((key) => {
    if (updatedData[key]) updatedObject[key] = updatedData[key];
  });

  return await DisciplineMonitor.findByIdAndUpdate(
    monitor._id,
    {
      ...updatedObject,
    },
    { upsert: true, new: true }
  );
};
const getMonitorList = async (filter = { class: "seven" }) => {
  const query = Object.keys(filter).reduce((acc, key) => {
    if (filter[key]) acc[key] = filter[key];
    return acc;
  }, {});

  return await DisciplineMonitor.find({ ...query });
};

const getMonitorListWithPoints = async (query = { class: "seven" }) => {
  const monitorList = await getMonitorList(query);
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
