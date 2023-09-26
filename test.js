require("dotenv").config();
// Establish connection to Database
const { connect, set: mongooseSet } = require("mongoose");
const DisciplineMonitor = require("./src/schemas/disciplineMonitor.schema");
mongooseSet("strictQuery", false);
connect(process.env.DATABASE_URI, {
  connectTimeoutMS: 10000,
})
  .then(async (connection) => {
    const response = await DisciplineMonitor.aggregate([
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
            $eq: [
              {
                $week: "$date_of_birth",
              },
              {
                $week: new Date(),
              },
            ],
          },
        },
      },
    ]);

    console.log(response);
  })
  .catch((err) => {
    console.log(err);
    console.log("⚠️ Failed to establish connection to database. exiting...");
    process.exit(1);
  });
