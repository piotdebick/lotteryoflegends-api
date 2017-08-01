var express = require('express');
var router = express.Router();

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');

var {mongoose} = require('../db/mongoose');
var {User} = require('../models/user');
var {authenticate} = require('../middleware/authenticate');

express().use(bodyParser);
// /user/
router.post('/', async (req, res) => {
  try{
    const body = _.pick(req.body, ['username', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
// /user/me
router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

// /user/login
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

// /user/me/token
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
