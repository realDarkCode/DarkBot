var CronJob = require("cron").CronJob;


const ascii = require("ascii-table");
const table = new ascii("Schedules").setHeading("SL", "schedule", "Status");


module.exports = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

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


      table.addRow(index + 1, schedule.name, "🟢");
    })

  );

<<<<<<< HEAD
<<<<<<< HEAD
  // log status
  if (table.__rows.length && process.env.LOG) console.log(table.toString());
  if (table.__rows.length) console.log(`${schedules.length} schedules loaded`);

=======
  table.addRow("", "Total:", count);

=======
  table.addRow("", "Total:", count);

>>>>>>> 1136500 (refactor(handlers): add components reload command, prettify handlers logging, minor fixes)
  // log status
  const status = count
    ? process.env.LOG_TABLE === "on"
      ? table.toString()
      : `${count} schedules loaded`
    : "No schedules found";

  console.log(status);

  return count;
<<<<<<< HEAD
>>>>>>> 1136500 (refactor(handlers): add components reload command, prettify handlers logging, minor fixes)
=======
>>>>>>> 1136500 (refactor(handlers): add components reload command, prettify handlers logging, minor fixes)
};
