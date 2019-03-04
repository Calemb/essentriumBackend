var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log(res.__dirname)
    res.json({
        l_name: 'Name',
        name: 'ess name'
    }).end()
});

module.exports = router;
