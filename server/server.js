require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');


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
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-auth');
    res.header('Access-Control-Expose-Headers', 'x-auth');
    next();
}


app.use(allowCrossDomain);

// getAllChamps();
//getFreeChamps();
weeklyWinners();
app.use(bodyParser.json());
app.use('/pick', pickRoute);
app.use('/users', userRoute);
app.use('/code', codeRoute.router);
app.use('/champs', champsRoute);


//app.use(express.static('public'));
// app.get('/', (req, res) => {
//   var randomCode = crypto.randomBytes(5).toString('hex');
//   req.randomCode = randomCode;
//   res.locals.randomCode = randomCode;
//   res.send('Hello, world!');
// });


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
