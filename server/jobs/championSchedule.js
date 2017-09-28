const _ = require('lodash');
const bodyParser = require('body-parser');
const axios = require('axios');

const {Champion} = require('./../models/champion');
const {Free} = require('./../models/free');
const keys = require('./../config/keys');
const api_key = keys.league_key;

var allChampURL = `https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=info&dataById=false&api_key=${api_key}`;

var freeChampURL = `https://na1.api.riotgames.com/lol/platform/v3/champions?freeToPlay=true&api_key=${api_key}`;

var getAllChamps = async () => {
  try {
    const response = await axios.get(allChampURL);
    await Champion.remove({});
    var allChamps = response.data;
    var champs = allChamps.data;
    //console.log(allChamps.data);
    for(var champ in champs){
      const body = _.pick(champs[champ], ['id', 'title', 'name', 'key']);
      var champion = new Champion(body);
      await champion.save();
    }
  } catch (e) {
    console.log(e.response);
  }
}

var getFreeChamps = async () => {
  try{
    const response = await axios.get(freeChampURL);
    await Free.remove({});
    var freeChamps = response.data;
    var champions = freeChamps.champions;
    var championIds = [];
    for(var i = 0; i < champions.length; i++){
      championIds.push(champions[i].id);
    }
    var freeChampions = new Free({championIds});
    await freeChampions.save();
  } catch (e) {
    console.log(e.response.status);
  }
}

module.exports = {getAllChamps, getFreeChamps};
