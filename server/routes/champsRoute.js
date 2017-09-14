var express = require('express');
var router = express.Router();
const _ = require('lodash');

const {mongoose} = require('../db/mongoose');
const {Champion} = require('./../models/champion');
const {Free} = require('./../models/free');
var {authenticate} = require('../middleware/authenticate');

//all champions
router.get('/', async (req, res) => {
  try{
    const champions = await Champion.find({});
    res.send(champions);
  } catch (e) {
    res.status(400).send();
  }

});

router.get('/free', authenticate, async (req, res) => {
  try{
    const freeChamps = await Free.find({});
    var freeChampIds = freeChamps[0].championIds;
    const champions = await Champion.find({'id': { $in : freeChampIds}});
    res.send(champions);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
