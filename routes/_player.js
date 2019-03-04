var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log(res.__dirname)
    res.json({
        l_name: 'Name',
        name: 'ess name',
        stats: [
            { l_name: 'STRENGTH', name: 'strength', value: 1.0 },
            { l_name: 'TOUGHNESS', name: 'toghnes', value: 1.0 },
            { l_name: 'WILLPOWER', name: 'willpower', value: 1.0 }
        ]
    })
});

module.exports = router;
