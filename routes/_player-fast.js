var express = require('express');
const store = require('../local_modules/store.js')
const players = store.db.collection('players')
var router = express.Router();
//ASSUME [DESIGN] imporatant is your actions, than choosen class
//in fact - more work you put in certain activities -> you got 'tag' for activities and bonuses for that!
//maybe make some time bonuses for regular activities
router.get('/', function (req, res, next) {
    console.log(res.__dirname)
    players.findOne({
        _id: req.body._id
    },
        (err, result) => {
            res.json({
                name: result.name,
                hp: result.hp
            })
        })
});

module.exports = router;
