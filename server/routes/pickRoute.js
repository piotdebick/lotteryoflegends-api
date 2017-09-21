var express = require('express');
var router = express.Router();
var moment = require('moment');

const {ObjectID} = require('mongodb');
var {mongoose} = require('../db/mongoose');
var {Pick} = require('../models/pick');
var {User} = require('../models/user');
var {authenticate} = require('../middleware/authenticate');

router.post('/', authenticate, async (req, res) => {
  //post picks to db
  var pick = new Pick({
    championPicks: req.body.championPicks,
    createdAt: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
    _creator: req.body._creator
  });
  try{
    var id = mongoose.Types.ObjectId(req.body._creator);
    var user = await User.findOne({_id: id});
    if(user.submissions < 1){
      const doc = await pick.save();
      await user.update({submissions: 1});
      res.send(doc);
    } else {
      res.send('You have already posted a ticket this week');
    }

  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/user/:userId', authenticate, async (req, res) => {
  //show picks
  try {
    const picks = await Pick.find({_creator: mongoose.Types.ObjectId(req.params.userId)}).sort({createdAt: -1}).limit(3);
    res.send({picks});
  } catch (e) {
    res.status(400).send(e)
  }
});

module.exports = router;
