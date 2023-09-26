const cron = require("node-cron");

module.exports = async (client) => {
  let count = 0;
  const { loadFiles } = require("../functions/fileLoader");

  const ascii = require("ascii-table");
  const table = new ascii("Schedules").setHeading("SL", "schedule", "Status");

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
      } else if (!cron.validate(schedule.frequency)) {
        table.addRow(
          index + 1,
          `${schedule.name || "MISSING"}`,
          `🔴  invalid frequency`
        );
        return;
      }
      if (!schedule.options) {
        schedule.options = {
          scheduled: true,
          timezone: "Asia/Dhaka",
        };
      }
      const cronTask = cron.schedule(
        schedule.frequency,
        () => schedule.task(client),
        schedule.options
      );
      count++;
      table.addRow(index + 1, schedule.name, "🟢");
    })
  );

  table.addRow("Total:", count);

  if (table.__rows.length) console.log(table.toString());
  else console.log("No schedules found");
};
