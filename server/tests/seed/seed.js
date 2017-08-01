const {ObjectID} = require('mongodb');
const {Pick} = require('./../../models/pick');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  username: 'piotrdebick',
  password: 'userOnePass',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  username: 'mandakow',
  password: 'userTwoPass',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]

}];

const picks = [{
  _id: new ObjectID(),
  championPicks: [0,1,2,4,54,6,7,54],
  _creator: userOneId
},
{
  _id: new ObjectID(),
  championPicks: [0,1,2,7,54],
  _creator: userTwoId,
  completedAt: 333
}];

const populatePicks = (done) => {
  Pick.remove({}).then(() => {
    return Pick.insertMany(picks);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {picks, populatePicks, users, populateUsers};
