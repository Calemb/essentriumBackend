const store = require('../local_modules/store.js')
const msgStore = store.db.collection('messages')

const gameplay = {
  sendMsg: function (req, res, next) {
    const _recipientId = store.ObjectId(req.body.recipientId)
    const title = req.body.title
    const content = req.body.content
    const adresser = req.body._id
    const owner = adresser

    const msg = {
      adresser,
      _recipientId,
      owner,
      title,
      content
    }
    const msg2 = msg1
    msg2.owner = _recipientId

    msgStore.insertMany([msg, msg2],
      (err, result) => {
        if (err) { res.json(err) }
        else {
          res.json(result)
        }
      })
  },
  getUnreaded: function (req, res, next) {
    msgStore
      .find({ owner: req.body._id })
      .count((err, founded) => {
        res.json({ count: founded })
      })
  },
  getMsgs: function (req, res, next) {
    //should send back all msgs contents
  }
}
module.exports = gameplay