const express = require('express')
const router = express.Router()

const gameplay = require('../LogicControllers/travel')



router.get('/', (req, res, next) => {
  gameplay.GetTravelData().then(result => {
    res.json(result)
  })
});

router.post('/', (req, res, next) => {
  gameplay.PostTravelData(req).then(result => {
    res.json(result)
  })
})

module.exports = router;
