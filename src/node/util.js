const fs = require("fs");

const getDate = () => {
  // add 3 hours for the isreal time zone
  const miliseconds = new Date().getTime() + +3 * 60 * 60 * 1000;
  return new Date(miliseconds).toISOString();
};

const sleep = (waitTime = null) => {
  const time = waitTime ? waitTime : (Math.random() * 3 + 1) * 1000;
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      return resolve();
    }, time);
  });
};

const getToken = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile("auth_token.json", "utf-8", (err, jsonString) => {
      if (err) {
        console.error(err);
        return reject(err.message);
      }
      const data = JSON.parse(jsonString);
      console.log("data", data);
      return resolve(data.auth_token);
    });
  });
};
const convertPrediction = (prediction) => {
  try {
    const result = prediction.reduce((acc, item) => {
      acc[item.class] = item.score;
      return acc;
    }, {});
    return result;
  } catch (error) {
    console.log("convertPrediction function", error.message);
  }
};
module.exports = {
  getDate,
  sleep,
  getToken,
  convertPrediction,
};
