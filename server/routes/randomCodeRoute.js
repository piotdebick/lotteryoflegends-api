var express = require('express');
var router = express.Router();

const crypto = require('crypto');

var randomCode = '';
//users/verification
//generates random code for summoner verification through masteries
router.get('/', (req, res) => {
    randomCode = crypto.randomBytes(7).toString('hex');
    res.locals.randomCode = randomCode;
    res.send(randomCode);
});

module.exports = {router, randomCode};
