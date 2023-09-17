const DisciplineMonitorPointHistory = require("../schemas/disciplineMonitorPointHistory.schema.js");
const DisciplineMonitor = require("../schemas/disciplineMonitor.schema.js");

const { POINTS, POINTS_CONST } = require("../config/NDT.config.js");

const findHistoryById = async (id) => {
  return await DisciplineMonitorPointHistory.findById(id);
};

const createHistory = async ({
  monitorId,
  pointType,
  reason,
  moderateBy,
  point,
}) => {
  const history = new DisciplineMonitorPointHistory({
    member: monitorId,
    type: POINTS_CONST[pointType] || pointType,
    point: POINTS[pointType] || point,
    reason,
    moderateBy,
  });
  await history.save();
  return history;
};

const createBulkHistory = async (
  monitorsId,
  pointType,
  reason,
  moderateBy,
  point
) => {
  const monitorPointHistoryWrite = [];
  monitorsId.forEach(async (monitor) => {
    monitorPointHistoryWrite.push({
      type: POINTS_CONST[pointType] || pointType,
      member: monitor._id,
      point: point || POINTS[pointType],
      reason: reason,
      moderateBy,
    });
  });
  return DisciplineMonitorPointHistory.create(monitorPointHistoryWrite);
};

const getWeeklyActiveMonitors = async () => {
  const lastSunday = new Date();
  const today = new Date();
  lastSunday.setDate(today.getDate() - today.getDay() - 1);

  const mostActiveMonitor = await DisciplineMonitorPointHistory.aggregate([
    {
      $match: {
        createdAt: {
          $gte: lastSunday, // Filter documents created within the last week
        },
      },
    },
    {
      $group: {
        _id: "$member",
        totalPoint: { $sum: "$point" },
      },
    },
    {
      $sort: { totalPoint: -1 },
    },
  ]);
  return mostActiveMonitor;
};
const getMonitorPointHistory = async (dbId, limit = 5) => {
  if (dbId) {
    const monitor = await DisciplineMonitor.findById(dbId);
    if (!monitor) throw new Error("Monitor not found with id: " + dbId);
  }
  const query = dbId ? { member: dbId } : {};

  const historyList = await DisciplineMonitorPointHistory.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
  return historyList;
};

module.exports = {
  createHistory,
  createBulkHistory,
  getMonitorPointHistory,
  findHistoryById,
  getWeeklyActiveMonitors,
};
