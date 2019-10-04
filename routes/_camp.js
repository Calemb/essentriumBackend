const express = require('express')
const router = express.Router()

const gameplay = require('../LogicControllers/travel')


router.post('/', async (req, res, next) => {
  const result = await gameplay.SetupCamp(req)
  res.json(result)
})

module.exports = router;
