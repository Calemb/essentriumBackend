var express = require('express');
var router = express.Router();
const sessionCfg = require('../local_modules/session')
const chalk = require('chalk')
const config = require('../config')

router.post('/', sessionCfg.strict, function (req, res, next) {
    var sess = req.session
    delete sess.email
    delete sess.password

    console.log(chalk.red("LOG OUT: " + sess.email))
    res.json({ location: config.pageafterLogout })
});

module.exports = router;
