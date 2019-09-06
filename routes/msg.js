
var express = require('express');

var router = express.Router();
const gameplay = require('../gameplay/msg')


router.post('/', gameplay.sendMsg);
router.post('/readed', gameplay.markReaded)
router.get('/unreaded', gameplay.getUnreaded);
router.get('/msgs', gameplay.getMsgs);

module.exports = router;
