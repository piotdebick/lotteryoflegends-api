var express = require('express');
var router = express.router();

router.get('/', (req, res) => {
  res.send('Hi');
})

module.exports = router;
