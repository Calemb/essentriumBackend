const express = require('express');
const router = express.Router();
const gameplay = require('../LogicControllers/player')

router.get('/', gameplay.GetLoggedPlayerStats);

module.exports = router;
