const moment = require("moment");

/**
 *  Returns true if the date is in the first week of month
 * @param {Date} date
 * @returns Boolean
 */
const isFirstWeekInMonth = (date) => {
  const daysInMonth = moment(date).date();

  return daysInMonth <= 7;
};

/**
 * Returns true if the input is a valid schedule format (e.g. Monday 12:00, Tuesday 13:00)
 * @param {String} input
 * @returns Boolean
 */
const isValidSchedule = (input) => {
  const schedule =
    /^(?:\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b \d{1,2}:\d{2}(?:, )?)+$/;
  return schedule.test(input);
};

/**
 * Converts a Date object to a Discord timestamp
 * @param {Date} date
 * @returns Number
 */
const toDiscordTime = (date) => {
  return Math.floor(date.getTime() / 1000);
};
module.exports = {
  isFirstWeekInMonth,
  isValidSchedule,
  toDiscordTime,
};
