var mongoose = require('mongoose');

var Champion = mongoose.model('Champion', {
  championId: Number,
  title: String,
  name: String,
  image: String,
  icon: String,
  difficulty: String
});

module.exports = {Champion};
