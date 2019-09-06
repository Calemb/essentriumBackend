const express = require('express');
const router = express.Router();
const stats = require('../store/player')

router.get('/', function (req, res, next) {
    stats.find(req.body._id, (err, result) => {
        console.log(res.__dirname)
        res.json(result)
    });
});

module.exports = router;
