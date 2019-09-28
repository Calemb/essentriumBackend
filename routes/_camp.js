const express = require('express')
const router = express.Router()

const gameplay = require('../LogicControllers/travel')


router.post('/', (req, res, next) => {
  gameplay.PostTravelData(req).then(result => {
    res.json(result)
  })
})

module.exports = router;
