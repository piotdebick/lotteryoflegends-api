var express = require('express');
var router = express.Router();

const crypto = require('crypto');
var { TempCode } = require('../models/tempCode');
//users/verification
//generates random code for summoner verification through masteries

router.get('/', async (req, res) => {
    var code = crypto.randomBytes(7).toString('hex');
    const temp = new TempCode({code: code, createdAt: new Date()});
    await temp.save();
    res.locals.randomCode = code;
    res.send(code);
});


module.exports = {router};
