const express = require('express');
const router = express.Router();

const player = require('../LogicControllers/player')

router.get('/', async (req, res, next) => {
  player.GetPlayersList().then(({ err, result }) => {
    if (err) { res.json(err) }
    else {
      res.json(result)
    }
  })
});

module.exports = router;
