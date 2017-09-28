const _ = require('lodash');
const axios = require('axios');
const keys = require('./../config/keys');
const api_key = keys.league_key;
var {TempCode} = require('./../models/tempCode');

var verifyUser = async (req, res, next) => {
  var body = _.pick(req.body, ['username', 'region', 'code']);

  var username = body.username;
  var region = body.region;
  var errorMessage = "Make sure your information is correct!";
  var userRequestURL = `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${username}?api_key=${api_key}`;

  try{
    const randomCode = await TempCode.findOne({code: body.code});
    const userInfo = await axios.get(userRequestURL);

    if(userInfo.data.name.toLowerCase() != username.toLowerCase()){
      errorMessage = 'Username does not exist in this region!';
      throw new Error();
    }
    var masteryRequestURL = `https://${region}.api.riotgames.com/lol/platform/v3/masteries/by-summoner/${userInfo.data.id}?api_key=${api_key}`;
    const masteryInfo = await axios.get(masteryRequestURL);
    var pages = masteryInfo.data.pages;

    if(pages[0].name === randomCode.code){
      req.body.username = userInfo.data.name;
      req.body.profileIconId = userInfo.data.profileIconId;
      req.body.summonerLevel = userInfo.data.summonerLevel;
      req.body.submissions = 0;
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
