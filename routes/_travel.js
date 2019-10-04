const express = require('express')
const router = express.Router()

const gameplay = require('../LogicControllers/travel')



router.get('/', async (req, res, next) => {
  const response = await gameplay.GetTravelData(req)
  res.json(response)
});

router.post('/', async (req, res, next) => {
  const response = await gameplay.PostTravelData(req)
  res.json(response)
})

module.exports = router;
