const DisciplineMonitorPoint = require("../schemas/disciplineMonitorPoint.schema.js");
const DisciplineMonitor = require("../schemas/disciplineMonitor.schema.js");

const monitorPointHistoryService = require("./disciplineMonitorPointHistory.service.js");
const { objKeyListUpperCase } = require("../helpers/convert.js");
const { POINTS, POINTS_CONST } = require("../config/NDT.config.js");

const findMonitorBySchoolId = async (id) => {
  return await DisciplineMonitor.findOne({ school_id: { $regex: `${id}$` } });
};
const findMonitorById = async (id) => {
  return await DisciplineMonitor.findById(id);
};

const addPoint = async (id, pointType, reason, moderateBy, point) => {
  const monitor = await findMonitorBySchoolId(id);
  if (!monitor) throw new Error("Monitor not found with school id: " + id);

  const pointHistory = await monitorPointHistoryService.createHistory({
    monitorId: monitor._id,
    pointType,
    reason,
    moderateBy,
    point,
  });

  const monitorPoint = await DisciplineMonitorPoint.findOneAndUpdate(
    { member: monitor._id },
    {
      $inc: { point: POINTS[pointType] || point },
    },
    { new: true, upsert: true }
  );

  return { pointHistory, point: monitorPoint.point, school_id: id };
};

const addBulkPoints = async ({
  schoolIds,
  cls,
  pointType,
  reason,
  moderateBy,
  point,
}) => {
  query = {};
  if (schoolIds) {
    query.school_id = { $regex: schoolIds.join("|") + "$", $options: "i" };
  }
  if (cls) {
    query.class = cls;
  }
  const monitors = await DisciplineMonitor.find(query).select({
    _id: 1,
    school_id: 1,
  });

  const monitorSchoolIds = monitors.map((monitor) => monitor.school_id);

  const pointAddedTo = await Promise.all(
    monitorSchoolIds.map(
      async (id) => await addPoint(id, pointType, reason, moderateBy, point)
    )
  );

  return (failedToAdd = schoolIds.filter(
    (schoolId) =>
      !pointAddedTo.some((monitor) =>
        new RegExp(schoolId + "$").test(monitor.school_id)
      )
  ));
};

const addBulkAttendancePoints = async (schoolIds, moderateBy, cls) => {
  return await addBulkPoints({
    schoolIds,
    pointType: POINTS_CONST.ATTENDANCE,
    reason: "Attend Duty",
    cls,
    moderateBy,
  });
};

const getPoint = async (monitorDBId) => {
  const point = await DisciplineMonitorPoint.findOne({ member: monitorDBId });

  return point ? point.point : 0;
};

const getPointBySchoolId = async (schoolId) => {
  const monitor = await findMonitorBySchoolId(schoolId);
  if (!monitor)
    throw new Error("Monitor not found with school id: " + schoolId);
  return await DisciplineMonitorPoint.findOne({ member: monitor._id });
};

module.exports = {
  addPoint,
  addBulkPoints,
  addBulkAttendancePoints,
  getPoint,
  getPointBySchoolId,
};
