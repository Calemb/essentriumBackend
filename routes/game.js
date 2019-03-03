var express = require('express');
var path = require('path')
var router = express.Router();
var sessionCfg = require('../local_modules/session.js')

router.get('/', sessionCfg.strict, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/game', 'index.html'))
});

module.exports = router;
