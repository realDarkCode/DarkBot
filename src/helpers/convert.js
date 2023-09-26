const convertToChoices = (list) => {
  return list.reduce((store, element) => {
    store.push({
      name: element.charAt(0).toUpperCase() + element.slice(1),
      value: element,
    });
    return store;
  }, []);
};

const objKeyListUpperCase = (obj) => {
  return Object.keys(obj).map((key) => key.toUpperCase());
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const filterEmpty = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key]) acc[key] = obj[key];
    return acc;
  }, {});
};

function timestampToRelativeTime(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours";
  } else if (elapsed < msPerMonth) {
    return "approximately " + Math.round(elapsed / msPerDay) + " days";
  } else if (elapsed < msPerYear) {
    return "approximately " + Math.round(elapsed / msPerMonth) + " months";
  } else {
    return "approximately " + Math.round(elapsed / msPerYear) + " years";
  }
}

const generateProgressBar = (length, totalLength, barLength = 20) => {
  const progress = (length / totalLength) * barLength;
  const progressBar = "=".repeat(progress) + "-".repeat(barLength - progress);
  return `[${progressBar}]`;
};

const secondsToDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds = String(Math.round(remainingSeconds)).padStart(
    2,
    "0"
  );
  return `${minutes}:${formattedSeconds}`;
};

module.exports = {
  convertToChoices,
  objKeyListUpperCase,
  capitalizeFirstLetter,
  filterEmpty,
  timestampToRelativeTime,
  generateProgressBar,
  secondsToDuration,
};
