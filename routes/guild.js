var express = require('express');
var router = express.Router();

const gameplay = require('../LogicControllers/guild')

//WORKING app layers -> separate

router.delete('/:id', async (req, res, next) => {
  const result = gameplay.deleteGuild(req.params.id, req.body._id)
  res.json(result)
})

router.post('/role', async (req, res, next) => {
  const result = await gameplay.setRole(req.body.memberId, req.body.newRole, req.body._id)
  res.json(result)
})

router.post('/create', async (req, res, next) => {
  const result = await gameplay.createGuild(req.body._id, req.body.name)
  res.json(result)
})

router.get('/requests/:decision(accept|deny)/:id', async (req, res, next) => {
  const result = await gameplay.requestDecision(req.params.id, req.params.decision)
  res.json(result)
})

router.get('/ask/:id', async (req, res, next) => {
  const result = await gameplay.ask(req.params.id, req.body._id)
  res.json = result
})

router.get('/my', async (req, res, next) => {
  const result = await gameplay.myGuild(req.body._id)
  res.json(result)
})

router.get('/all', async (req, res, next) => {
  const result = await gameplay.allGuilds()
  res.json(result)
})



module.exports = router

//FEATURE [near] diary for player / msg(?) to inform about deny/accept (live diary on socket io, but allow enter it from link)
//TODO view player stats API and link in every front end
//TODO fight PvP PvE