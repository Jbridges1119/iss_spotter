// index.js
const { nextISSTimesForMyLocation, printPassTimes } = require('./iss');


// fetchMyIP((error, ip) => {
//   if (error) return console.log("It didn't work!" , error);
//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP(ip, (error, data) => {
//   if (error) return console.log("ERROR!", error)
//   console.log("WORKING!", data)
// })

// coords = { latitude: '49.69919967651367', longitude: '-112.8233413696289' };
// fetchISSFlyOverTimes(coords, (error, info) => {
//   if (error) return console.log(error);
//   console.log(info);
// });



nextISSTimesForMyLocation((error, passTimes) => {
  if (error) return console.log("It didn't work!", error);
  printPassTimes(passTimes);
});


