var mongoose = require('mongoose');

var Winner = mongoose.model('Winner', {
  userID: String,
  name: String,
  correct: Number,
  date: String
});

module.exports = {Winner};
