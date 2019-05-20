var express = require('express');
var router = express.Router();

const gameplay = require('../gameplay/guild')

//FEATURE [near] diary for player / msg(?) to inform about deny/accept (live diary on socket io, but allow enter it from link)
router.post('/role', gameplay.setRole)
//TODO view player stats API and link in every front end
//TODO fight PvP PvE
router.get('/requests/:decision(accept|deny)/:id', gameplay.requestDecision)
router.get('/ask/:id', gameplay.ask)
router.delete('/:id', gameplay.deleteGuild)
router.post('/create', gameplay.createGuild)
router.get('/my', gameplay.myGuild)
router.get('/all', gameplay.allGuilds)



module.exports = router