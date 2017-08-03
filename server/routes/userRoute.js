var express = require('express');
var router = express.Router();

const _ = require('lodash');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
var {mongoose} = require('../db/mongoose');
var {User} = require('../models/user');
var {authenticate} = require('../middleware/authenticate');
var {verifyUser} = require('../middleware/verifyUser');

express().use(bodyParser);

// /users/
//user sign up
router.post('/', verifyUser, async (req, res) => {
  try{
    const body = _.pick(req.body, ['username', 'password', 'region']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// /users/me
//returns authenticated user
router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

// /users/login
router.post('/login', async (req, res) => {
  try{
    const body = _.pick(req.body, ['username', 'password']);
    const user = await User.findByCredentials(body.username, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// /users/me/token
router.post('/me/token', authenticate, async (req, res) => {
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  }catch (e) {
    res.status(400).send();
  }
});

router.delete('/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;
