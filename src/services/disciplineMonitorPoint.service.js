const DisciplineMonitorPoint = require("../schemas/disciplineMonitorPoint.schema.js");
const DisciplineMonitor = require("../schemas/disciplineMonitor.schema.js");

const { objKeyListUpperCase } = require("../helpers/convert");
const { POINTS, POINTS_CONST } = require("../config/NDT.config");

const findMonitorBySchoolId = async (id) => {
  return await DisciplineMonitor.findOne({ school_id: id });
};
const findMonitorById = async (id) => {
  return await DisciplineMonitor.findById(id);
};

const addPoint = async (id, pointType, reason, moderateBy) => {
  const monitor = await findMonitorBySchoolId(id);
  if (!monitor) throw new Error("Monitor not found with school id: " + id);
  const newPoint = new DisciplineMonitorPoint({
    type: POINTS_CONST[pointType],
    member: monitor._id,
    point: POINTS[pointType],
    reason,
    moderateBy,
  });
  return await newPoint.save();
};

const addBulkAttendancePoint = async (ids, moderateBy) => {
  const monitors = await DisciplineMonitor.find({ school_id: { $in: ids } });

  const dbWrite = [];

  monitors.forEach(async (monitor) => {
    dbWrite.push({
      type: POINTS_CONST["ATTENDANCE"],
      member: monitor._id,
      point: POINTS["ATTENDANCE"],
      reason: "Attendance",
      moderateBy,
    });
  });
  await DisciplineMonitorPoint.create(dbWrite);
  return (failedToAdd = ids.filter(
    (id) => !monitors.some((monitor) => monitor.school_id === id)
  ));
};

const addSpecialPoint = async (id, point, reason, moderateBy) => {
  const monitor = await findMonitorBySchoolId(id);
  if (!monitor) throw new Error("Monitor not found with school id: " + id);
  const newPoint = new DisciplineMonitorPoint({
    type: "SPECIAL",
    member: monitor._id,
    point: point,
    reason,
    moderateBy,
  });
  return await newPoint.save();
};

const getPoint = async (monitorDBId) => {
  const points = await DisciplineMonitorPoint.find({ member: monitorDBId });
  return points.reduce((store, point) => {
    store += point.point;
    return store;
  }, 0);
};

const getMonitorPointHistory = async (id) => {
  const monitor = await findMonitorById(id);
  if (!monitor) throw new Error("Monitor not found with school id: " + id);
  return await DisciplineMonitorPoint.find({ member: monitor._id }).limit(5);
};

module.exports = {
  addPoint,
  getPoint,
  getMonitorPointHistory,
  addSpecialPoint,
  addBulkAttendancePoint,
};
