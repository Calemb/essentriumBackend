const express = require('express');
const router = express.Router();
const gameplay = require('../LogicControllers/player')

router.get('/', (req, res) => {
  gameplay.GetLoggedPlayerStats(req).then(responseData => {
    res.json(responseData)
  })
});

module.exports = router;
