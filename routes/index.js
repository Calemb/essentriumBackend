var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //PRAWDZIWE LOGOWANIE NASTEPUJE PONIZEJ
    var sess = req.session;
    console.log("ciastka: " + JSON.stringify(req.cookies))
    console.log("sesja: " + JSON.stringify(sess))


    //render
    res
        .json({
            mail: sess.email,
            data: sess.id
        }).end()
    // .status(200)
});

module.exports = router;
