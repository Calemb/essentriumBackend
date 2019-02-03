var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    //PRAWDZIWE LOGOWANIE NASTEPUJE PONIZEJ
    var sess = req.session;
    console.log("ciastka: " + JSON.stringify(req.cookies))
    console.log("sesja: " + JSON.stringify(sess))
    if (typeof sess != 'undefined') {
        //render
        res
            .json({
                mail: sess.email,
                data: sess.id
            }).end()
        // .status(200)

    }
    else {
        res.json({
            data: 'index data from node'
        })
    }

});

module.exports = router;
