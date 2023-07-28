const convertToChoices = (list) => {
  return list.reduce((store, element) => {
    store.push({
      name: element.charAt(0).toUpperCase() + element.slice(1),
      value: element,
    });
    return store;
  }, []);
};

module.exports = { convertToChoices };
