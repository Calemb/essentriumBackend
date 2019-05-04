
var express = require('express');
const store = require('../local_modules/store.js')
var router = express.Router();
const msgStore = store.db.collection('messages')
const gameplay = require('../gameplay/fight')

router.post('/fast', gameplay.fastFight)

module.exports = router;
