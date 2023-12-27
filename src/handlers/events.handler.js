const loadEvents = async (client) => {
  const { loadFiles } = require("../functions/fileLoader");

  // Initialize the table for logging status
  const ascii = require("ascii-table");
  const table = new ascii("Events Loaded").setHeading("S/N", "Event", "Status");

  // clear previous events from cache
  await client.events.clear();

  const events = await loadFiles("events");
  const eventList = [];
  // execute each event
  events.forEach((eventFile, index) => {
    const event = require(eventFile);
    try {
      const execute = (...args) => event.execute(client, ...args);

      // add event to cache
      client.events.set(event.name, execute);

      // listen for event
      if (event.rest) {
        if (event.once) client.rest.once(event.name, execute);
        else client.rest.on(event.name, execute);
      } else {
        if (event.once) client.on(event.name, execute);
        else client.on(event.name, execute);
      }
      table.addRow(index + 1, event.name, "🟩");
      eventList.push(event.name);
    } catch (error) {
      console.log(error);
      table.addRow(index + 1, event.name, "🟥");
    }
  });
  table.addRow("", "total", eventList.length);

  // log status
  const status = eventList.length
    ? process.env.LOG_TABLE === "on"
      ? table.toString()
      : `${eventList.length} events loaded`
    : "No events found";

  console.log(status);

  return eventList;
};

module.exports = loadEvents;
