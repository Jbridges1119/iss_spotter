const request = require('request-promise-native');

const fetchMyIP = () => request('https://api.ipify.org?format=json');

const fetchCoordsByIP = (ip) => {
  const data = JSON.parse(ip).ip
  return request(`https://freegeoip.app/json/${data}`)
}

const fetchISSFlyOverTimes = (coord) => {
  const {latitude, longitude} = JSON.parse(coord)
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`
  return request(url)
}

const nextISSTimesForMyLocation = () => fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(data => {
    const { info } = JSON.parse(data)
    return info
  });

  const printPassTimes = (times) => {
    for (let time of times) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(time.risetime);
      console.log(`Next pass at ${datetime} for ${time.duration} seconds!`);
    }
  };

//request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`)
module.exports = { nextISSTimesForMyLocation, printPassTimes };