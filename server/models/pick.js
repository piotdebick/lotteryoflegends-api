var mongoose = require('mongoose');

var Pick = mongoose.model('Pick', {
  championPicks: {
    type: Object,
    required: true
  },
  createdAt: {
    type: String,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Pick};
