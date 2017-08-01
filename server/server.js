require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT || 3000;

var pickRoute = require('./routes/pickRoute');
var userRoute = require('./routes/userRoute');

app.use(bodyParser.json());
app.use('/pick', pickRoute);
app.use('/users', userRoute);

//app.use(express.static('public'));
// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
