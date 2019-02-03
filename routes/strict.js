var express = require('express');
var router = express.Router();
var sessionCfg = require('../local_modules/session.js')

/* GET home page. */
router.get('/', sessionCfg.strict, function (req, res, next) {
    //PRAWDZIWE LOGOWANIE NASTEPUJE PONIZEJ
    var sess = req.session;
    console.log("stricted: " + JSON.stringify(req.cookies))
    console.log("sesja stricted: " + JSON.stringify(sess))


    //render
    res
        .json({
            mail: sess.email,
            data: sess.id
        }).end()
    // .status(200)
});

module.exports = router;
