const fetch = require("node-fetch");

const getCatImage = async () => {
  const response = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await response.json();
  return data[0];
};

const getCatFact = async () => {
  const response = await fetch("https://meowfacts.herokuapp.com/");
  const data = await response.json();
  return data.data[0];
};

const getACat = async () => {
  const image = await getCatImage();
  const fact = await getCatFact();

  return { fact, image };
};
module.exports = { getACat };
