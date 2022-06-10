const {nextISSTimesForMyLocation} = require('./iss_promised');
const {printPassTimes} = require('./iss_promised');


nextISSTimesForMyLocation()
  .then((times) => {printPassTimes(times);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  })

