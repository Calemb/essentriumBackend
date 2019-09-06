var express = require('express');
var router = express.Router();
const sessionCfg = require('../local_modules/session')
const chalk = require('chalk')
const config = require('../config')

router.post('/', sessionCfg.plain, function (req, res, next) {
    var sess = req.session

    if (sess.email || sess.password) {
        delete sess.email
        delete sess.password
    }

    console.log(chalk.red("LOG OUT: " + sess.email))
    res.json({ location: config.pageafterLogout })
});

module.exports = router;
