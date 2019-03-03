var express = require('express');
var path = require('path')
var router = express.Router();
// var sessionCfg = require('../local_modules/session.js')

router.get('/', function (req, res, next) {
    console.log(res.__dirname)
    res.sendFile(path.join(res.__dirname, './test', 'index.html'))
});

module.exports = router;
