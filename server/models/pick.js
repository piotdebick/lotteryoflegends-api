var mongoose = require('mongoose');

var Pick = mongoose.model('Pick', {
  championPicks: {
    type: [Number],
    required: true
  },
  createdAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Pick};
