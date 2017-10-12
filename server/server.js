require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

var app = express();
const port = process.env.PORT || 3001;

var {getAllChamps, getFreeChamps} = require('./jobs/championSchedule.js');
var {weeklyWinners} = require('./jobs/winnerSchedule.js');
var pickRoute = require('./routes/pickRoute');
var userRoute = require('./routes/userRoute');
var champsRoute = require('./routes/champsRoute');
var codeRoute = require('./routes/codeRoute');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-auth');
    res.header('Access-Control-Expose-Headers', 'x-auth');
    next();
}




var championsUpdate = schedule.scheduleJob('* 20 59 * 2', () => {
   getAllChamps();
   getFreeChamps();
});

var winnersUpdate = schedule.scheduleJob('* 59 23 * 2', () => {
   weeklyWinners();
});

getAllChamps();
getFreeChamps();

app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use('/pick', pickRoute);
app.use('/users', userRoute);
app.use('/code', codeRoute.router);
app.use('/champs', champsRoute);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
