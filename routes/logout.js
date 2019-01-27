var express = require('express');
var router = express.Router();

/*
*******
* POST for example for ajax !?
*******
*/
router.post('/', function (req, res, next) {
    console.log(req.session);
    res.send('respond from logout');
});

module.exports = router;
