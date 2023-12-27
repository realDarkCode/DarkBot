var CronJob = require("cron").CronJob;

module.exports = async (client) => {
  let count = 0;
  const { loadFiles } = require("../functions/fileLoader");

  const ascii = require("ascii-table");
  const table = new ascii("Schedules Loaded").setHeading(
    "SL",
    "schedule",
    "Status"
  );

  const schedules = await loadFiles("schedules");
  await Promise.all(
    schedules.map(async (file, index) => {
      const schedule = require(file);
      if (!schedule.name || !schedule.frequency || !schedule.task) {
        table.addRow(
          index + 1,
          `${schedule.name || "MISSING"}`,
          `🔴  invalid or missing frequency or task function`
        );
        return;
      }

      new CronJob(
        schedule.frequency,
        () => schedule.task(client),
        schedule.options?.onComplete || null,
        schedule.options?.start || true,
        schedule.options?.timeZone || "Asia/Dhaka"
      );

      count++;
      table.addRow(index + 1, schedule.name, "🟢");
    })
  );

  table.addRow("", "Total:", count);

  // log status
  const status = count
    ? process.env.LOG_TABLE === "on"
      ? table.toString()
      : `${count} schedules loaded`
    : "No schedules found";

  console.log(status);

  return count;
};
