var mongoose = require('mongoose');

var Champion = mongoose.model('Champion', {
  id: Number,
  title: String,
  name: String,
  key: String,
  info: Object
});

module.exports = {Champion};
