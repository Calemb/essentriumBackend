
var express = require('express');

var router = express.Router();
const gameplay = require('../gameplay/msg')


router.post('/', gameplay.sendMsg);
router.get('/unreaded', gameplay.getUnreaded);
//TODO INBOX!

module.exports = router;
