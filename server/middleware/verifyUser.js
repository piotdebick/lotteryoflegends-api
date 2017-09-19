const _ = require('lodash');
const axios = require('axios');
const keys = require('./../config/keys');
const api_key = keys.league_key;
var TempCode = require('../models/tempCode');

var verifyUser = async (req, res, next) => {
  var body = _.pick(req.body, ['username', 'region', 'code']);
  var randomCode = await TempCode.findOne({code: body.code});
  var username = body.username;
  var region = 'na1';
  var errorMessage = "Make sure your information is correct!";
  var userRequestURL = `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${username}?api_key=${api_key}`;

  try{
    const userInfo = await axios.get(userRequestURL);

    if(userInfo.data.name.toLowerCase() != username.toLowerCase()){
      errorMessage = 'Username does not exist in this region!';
      throw new Error();
    }

    var masteryRequestURL = `https://${region}.api.riotgames.com/lol/platform/v3/masteries/by-summoner/${userInfo.data.id}?api_key=${api_key}`;
    const masteryInfo = await axios.get(masteryRequestURL);
    var pages = masteryInfo.data.pages;
    if(pages[0].name === randomCode){
      next();
    }
    else {
      errorMessage = 'Make sure you change your first mastery page name to the random code provided!';
      throw new Error();
    }
  } catch (e) {
    res.status(401).send(errorMessage);
  }

};

module.exports = {verifyUser};
