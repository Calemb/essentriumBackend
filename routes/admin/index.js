const express = require('express')
const router = express.Router()
const adminPlayers = require('../../gameplay/admin/players')

router.get('/players', adminPlayers.getPlayers)

router.post('/players', adminPlayers.postPlayer)

module.exports = router