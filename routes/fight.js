
var express = require('express');
var router = express.Router();
const gameplay = require('../LogicControllers/fight')

router.post('/fast', (req, res, next) => {
  try {
    gameplay.fastFight(req.body._id, req.body.enemyId).then(result => {
      res.json(result)
    })
  } catch (e) {
    res.status(500).json({ err: e, results: undefined })
  }
})

module.exports = router;
