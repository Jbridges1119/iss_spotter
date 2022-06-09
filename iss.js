/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, desc) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) return callback(Error(`Status Code ${response.statusCode} when fetching IP: ${desc}`), null);
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(desc).ip;
      if (data.length > 0) {
        return callback(error, data);
      }
      return callback(Error("Did not grab IP", null));
    }
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) return callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
    const { latitude, longitude } = JSON.parse(body);
    return callback(null, { latitude, longitude });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) return callback(Error(`Status code ${response.statusCode} when searching info`));
    const info = JSON.parse(body).response;
    return callback(error, info);
  });
};


// iss.js

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = callback => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return callback(error, null);
      fetchISSFlyOverTimes(coords, (error, info) => {
        if (error) return callback(error, null);
        callback(error, info);
      });
    });
  });
};

const printPassTimes = (times) => {
  for (let time of times) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(time.risetime);
    console.log(`Next pass at ${datetime} for ${time.duration} seconds!`);
  }
};

module.exports = { nextISSTimesForMyLocation, printPassTimes };