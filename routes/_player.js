var express = require('express');
var router = express.Router();
var stats = require('../store/player.js')

router.get('/', function (req, res, next) {
    stats.find(req.body._id, (err, result) => {
        var stats = [
            { l_name: 'STRENGTH', name: 'strength', value: 1.0 },
            { l_name: 'TOUGHNESS', name: 'toghnes', value: 1.0 },
            { l_name: 'WILLPOWER', name: 'willpower', value: 1.0 }
        ]
        console.log(res.__dirname)
        res.json({
            l_name: 'Name',
            name: result.name,
            stats: stats
        })
    });
});

module.exports = router;
