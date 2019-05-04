
var express = require('express');
const store = require('../local_modules/store.js')
var router = express.Router();
const msgStore = store.db.collection('messages')

router.post('/', function (req, res, next) {
  const _recipientId = store.ObjectId(req.body.recipientId)
  const title = req.body.title
  const content = req.body.content
  const adresser = req.body._id;

  msgStore.insertOne({
    adresser,
    _recipientId,
    title,
    content
  }, (err, result) => {
    if (err) { res.json(err) }
    else {
      res.json(result)
    }
  })
});
//TODO INBOX!

module.exports = router;
