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

module.exports = {
  convertToChoices,
  objKeyListUpperCase,
  capitalizeFirstLetter,
  filterEmpty,
};
