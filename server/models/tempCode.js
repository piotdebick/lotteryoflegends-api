var mongoose = require('mongoose');

var TempCode = mongoose.model('TempCode', {
  code: String,
  createdAt: {
    type: Date, expires: '1h'
  }
});

module.exports = {TempCode};
