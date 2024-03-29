const DisciplineMonitor = require("../schemas/disciplineMonitor.schema.js");
const { filterEmpty } = require("../helpers/convert.js");
const disciplineMonitorPointService = require("./disciplineMonitorPoint.service.js");
const disciplineMonitorPointHistoryService = require("./disciplineMonitorPointHistory.service.js");

const findMonitorById = async (id, cls) => {
  const query = {};
  if (id) query.school_id = { $regex: `${id}$` };
  if (cls) query.class = cls;

  return await DisciplineMonitor.findOne({
    ...query,
  });
};

const addMonitor = async (id, name, cls) => {
  const monitor = await findMonitorById(id, cls);
  if (monitor) throw new Error("Monitor already exists with school id: " + id);
  const newMonitor = new DisciplineMonitor({
    school_id: id,
    name,
    class: cls,
  });
  return await newMonitor.save();
};

const updateMonitorInfo = async (id, updatedData) => {
  const monitor = await findMonitorById(id);
  if (!monitor) throw new Error("Monitor not found with school id: " + id);

  const updatedObject = filterEmpty(updatedData);

  return await DisciplineMonitor.findByIdAndUpdate(
    monitor._id,
    {
      ...updatedObject,
    },
    { upsert: true, new: true }
  );
};
const getMonitorList = async (filter = { class: "seven" }) => {
  const query = filterEmpty(filter);

  return await DisciplineMonitor.find({ ...query });
};

const getMonitorListWithPoints = async (query = { class: "seven" }) => {
  const monitorList = await getMonitorList(query);
  const monitorListWithPoint = await Promise.all(
    monitorList.map(async (monitor) => {
      const point = await disciplineMonitorPointService.getPoint(monitor._id);
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

const getDataOfWeeklyActiveMonitors = async ({ limit = 10, query }) => {
  const activeList =
    await disciplineMonitorPointHistoryService.getWeeklyMonitors({
      limit,
      asc: true,
      query,
    });

  const inactiveList =
    await disciplineMonitorPointHistoryService.getWeeklyMonitors({
      limit,
      asc: false,
      query,
    });
  return {
    activeList,
    inactiveList,
  };
};

const getCurrentBirthdayMonitors = async (dateType = month) => {
  let filter = [
    {
      $week: "$date_of_birth",
    },
    {
      $week: new Date(),
    },
  ];

  if (dateType === "month") {
    filter = [
      {
        $month: "$date_of_birth",
      },
      {
        $month: new Date(),
      },
    ];
  }

  return await DisciplineMonitor.aggregate([
    {
      $addFields: {
        date_of_birth: {
          $dateFromParts: {
            year: {
              $year: new Date(),
            },
            month: {
              $month: "$date_of_birth",
            },
            day: {
              $dayOfMonth: "$date_of_birth",
            },
          },
        },
      },
    },
    {
      $match: {
        $expr: {
          $eq: [...filter],
        },
      },
    },
    { $sort: { date_of_birth: -1 } },
  ]);
};
module.exports = {
  addMonitor,
  updateMonitorInfo,
  getMonitorList,
  findMonitorById,
  getMonitorListWithPoints,
  getDataOfWeeklyActiveMonitors,
  getCurrentBirthdayMonitors,
};
