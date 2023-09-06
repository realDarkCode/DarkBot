require("dotenv").config();

const disciplineMonitor = require("./src/services/disciplineMonitor.service.js");

const { connect, set: mongooseSet } = require("mongoose");
mongooseSet("strictQuery", false);

const run = async () => {
  const result = await disciplineMonitor.getDataOfWeeklyActiveMonitors();

  console.log(result);
};

connect(process.env.DATABASE_URI, {
  connectTimeoutMS: 10000,
})
  .then((connection) => {
    console.log(`Connected to database: ${connection.connection.name}`);

    run();
  })
  .catch((err) => {
    console.log(err);
    console.log("⚠️ Failed to establish connection to database. exiting...");
    process.exit(1);
  });
