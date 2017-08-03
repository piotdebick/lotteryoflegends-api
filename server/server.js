require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');


var app = express();
const port = process.env.PORT || 3000;

var pickRoute = require('./routes/pickRoute');
var userRoute = require('./routes/userRoute');
var randomCodeRoute = require('./routes/randomCodeRoute');

app.use(bodyParser.json());
app.use('/pick', pickRoute);
app.use('/users', userRoute);
app.use('/code', randomCodeRoute.router);


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
