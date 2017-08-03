const _ = require('lodash');
const bodyParser = require('body-parser');
const axios = require('axios');
const schedule = require('node-schedule');

const {Champion} = require('./../models/champion');
const keys = require('./../config/keys');
const api_key = keys.league_key;

var champURL = `https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=info&dataById=false&api_key=${api_key}`;

var getAllChamps = async () => {
  try {
    const response = await axios.get(champURL);
    var allChamps = response.data;
    var champs = allChamps.data;
    //console.log(allChamps.data);
    for(var champ in champs){
      const body = _.pick(champs[champ], ['id', 'title', 'name', 'key', 'info']);
      var champion = new Champion(body);
      champion.save();
    }
  } catch (e) {
    console.log(e.response.status);
  }
}

var tuesdayUpdate = schedule.scheduleJob('* * * * 2', () => {
  //getAllChamps();
})

module.exports = {getAllChamps};
