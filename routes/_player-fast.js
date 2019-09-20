const express = require('express');
const router = express.Router();


const gameplay = require('../LogicControllers/player')

//ASSUME [DESIGN] imporatant is your actions, than choosen class
//in fact - more work you put in certain activities -> you got 'tag' for activities and bonuses for that!
//maybe make some time bonuses for regular activities
router.get('/', (req, res, next) => {
    gameplay.GetLoggedPlayerStats(req).then(({ err, result }) => {
        if (err) { res.json(err) }

        res.json({
            name: result.name,
            hp: result.hp
        })
    })
});

module.exports = router;
