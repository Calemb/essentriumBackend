const express = require('express');
const store = require('../local_modules/store.js')
const accounts = store.db.collection('accounts')
const router = express.Router()


router.get('/', (req, res, next) => {
  accounts.findOne({ _id: req.body._id }, (err, result) => {
    res.json({ priviliges: result.priviliges })
  })
})

module.exports = router