var express = require('express');
var router = express.Router();
var sessionCfg = require('../local_modules/session.js')

router.get('/', sessionCfg.strict, function (req, res, next) {
    var sess = req.session
    if (sess.email != '') //perform real check!
    {
        //delete session
        delete sess.email
    }
    res
        .json({
            maill: sess.email
        })
        .end()
});

module.exports = router;
