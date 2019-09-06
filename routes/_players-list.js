const express = require('express');
const router = express.Router();
const player = require('../store/player')

router.get('/', async (req, res, next) => {
  player.playersList().then(({ err, result }) => {
    if (err) { res.json(err) }
    else {
      res.json(result)
    }

  })
});

module.exports = router;
