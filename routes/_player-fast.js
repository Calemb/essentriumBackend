const express = require('express');
const router = express.Router();

const gameplay = require('../LogicControllers/player')

const playerSmallView = { name: '', hp: '' }

router.get('/', (req, res, next) => {
    gameplay.GetLoggedPlayerStats(req).then(({ err, result }) => {
        if (err) {
            //merge error with view
            res.json({ ...err, ...playerSmallView })
        }

        //fill data before send
        playerSmallView.name = result.name
        playerSmallView.hp = result.hp

        res.json(playerSmallView)
    })
});

module.exports = router;
//ASSUME [DESIGN] imporatant is your actions, more than choosen class
//in fact - more work you put in certain activities -> you got 'tag' for activities and bonuses for that!
//maybe make some time bonuses for regular activities