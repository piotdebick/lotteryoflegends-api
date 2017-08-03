const _ = require('lodash');
const bodyParser = require('body-parser');
const axios = require('axios');
const schedule = require('node-schedule');

const champion = require('./../models/champion');
const keys = require('./../config/keys');
const api_key = keys.league_key;
