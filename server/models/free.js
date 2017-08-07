var mongoose = require('mongoose');

var Free = mongoose.model('Free', {
  championIds: Array
});

module.exports = {Free};
