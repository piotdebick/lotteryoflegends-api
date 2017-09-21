const _ = require('lodash');
const axios = require('axios');
const schedule = require('node-schedule');
const {mongoose} = require('../db/mongoose');
const {Free} = require('./../models/free');
const {Pick} = require('./../models/pick');
const {Winner} = require('./../models/winner');
const {User} = require('./../models/user');

const weeklyWinners = async () => {
  try {
    await Winner.remove({});
    await User.updateMany({}, {$set: {submissions: 0}});
    var freeChamps = await Free.find({});
    var freeChampIds = freeChamps[0].championIds;
    var winners = await Pick.find({'championPicks.id': { $in : freeChampIds}});

    var correctGuessedDocuments = [];
    for(var winner in winners) {
      var summoner = winners[winner];
      var temp = summoner.championPicks.filter((el) => {
        return freeChampIds.indexOf(el.id) > -1;
      })
      correctGuessedDocuments.push({
        summoner: summoner._creator,
        correct: temp.length,
        date: summoner.createdAt
      });
    }

    var byCorrect = correctGuessedDocuments.slice(0);
    byCorrect.sort((a, b)=>{
      return b.correct - a.correct;
    });

    var topThreeWinners = byCorrect.slice(0,3);

    for(const summoner of topThreeWinners){
      var userID = mongoose.Types.ObjectId(summoner.summoner);
      var user = await User.find({_id: userID});
      var winner = new Winner({
        userID: summoner.summoner,
        name: user.username,
        correct: summoner.correct,
        date: summoner.date
      });
      await winner.save();
    }

  } catch (e) {
    console.log(e);
  }
}

module.exports = {weeklyWinners};
