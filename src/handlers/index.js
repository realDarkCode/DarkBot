const loadEvents = require("./events.handler");
const loadCommands = require("./command.handler");
const loadComponents = require("./component.handler");
const loadSystems = require("./system.handler");
const loadSchedules = require("./schedule.handler");
module.exports = {
  loadEvents,
  loadCommands,
  loadComponents,
  loadSystems,
  loadSchedules,
};
