const express = require('express');
const router = express.Router()
const gameplay = require('../LogicControllers/account')

router.get('/', (req, res, next) => {
  gameplay.GetAccountPriviliges(req).then(response => {
    if (response.err) { res.json(err) }
    else {
      res.json(response.priviliges)
    }
  })
})

module.exports = router