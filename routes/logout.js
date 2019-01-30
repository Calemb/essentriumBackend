var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    var sess = req.session
    if(sess.email != '') //perform real check!
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
