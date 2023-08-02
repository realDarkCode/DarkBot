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

const addBulkPoint = async (ids, pointType, reason, moderateBy, point) => {
  const monitors = await DisciplineMonitor.find({
    school_id: { $regex: ids.join("|") + "$", $options: "i" },
  });

  const dbWrite = [];
  monitors.forEach(async (monitor) => {
    dbWrite.push({
      type: POINTS_CONST[pointType] || pointType,
      member: monitor._id,
      point: point || POINTS[pointType],
      reason: reason,
      moderateBy,
    });
  });
  await DisciplineMonitorPoint.create(dbWrite);

  return (failedToAdd = ids.filter(
    (id) =>
      !monitors.some((monitor) => new RegExp(id + "$").test(monitor.school_id))
  ));
};

const addBulkAttendancePoint = async (ids, moderateBy) => {
  return await addBulkPoint(
    ids,
    POINTS_CONST.ATTENDANCE,
    "Attend Duty",
    moderateBy
  );
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
  return await DisciplineMonitorPoint.find({ member: monitor._id })
    .sort("-createdAt")
    .limit(5);
};

module.exports = {
  addPoint,
  getPoint,
  getMonitorPointHistory,
  addSpecialPoint,
  addBulkAttendancePoint,
  addBulkPoint,
};
