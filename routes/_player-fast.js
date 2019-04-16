var express = require('express');
var router = express.Router();
//ASSUME [DESIGN] imporatant is your actions, than choosen class
//in fact - more work you put in certain activities -> you got 'tag' for activities and bonuses for that!
//maybe make some time bonuses for regular activities
router.get('/', function (req, res, next) {
    console.log(res.__dirname)
    res.json({
        name: 'John Doe'
    }).end()
});

module.exports = router;
