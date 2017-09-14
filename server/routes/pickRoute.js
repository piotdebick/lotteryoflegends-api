var express = require('express');
var router = express.Router();
var moment = require('moment');

const {ObjectID} = require('mongodb');
var {mongoose} = require('../db/mongoose');
var {Pick} = require('../models/pick');
var {authenticate} = require('../middleware/authenticate');

router.post('/', authenticate, async (req, res) => {
  //post picks to db
  var pick = new Pick({
    championPicks: req.body.championPicks,
    createdAt: moment().toString(),
    _creator: req.body._creator
  });
  try{
    const doc = await pick.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/', authenticate, async (req, res) => {
  //show picks
  try {
    const picks = await Pick.find({_creator: req.body._creator});
    res.send({picks});
  } catch (e) {
    res.status(400).send(e)
  }
});

module.exports = router;
