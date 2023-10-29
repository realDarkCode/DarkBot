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

module.exports = {
  isFirstWeekInMonth,
};
