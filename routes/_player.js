var express = require('express');
var router = express.Router();
var stats = require('../store/player.js')

router.get('/', function (req, res, next) {
    stats.find(req.body._id, (err, result) => {
        console.log(res.__dirname)
        res.json(result)
    });
});

module.exports = router;
