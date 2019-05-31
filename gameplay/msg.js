const store = require('../local_modules/store.js')
const msgStore = store.db.collection('messages')

const gameplay = {
  sendMsg: async function (req, res, next) {
    const _recipientId = store.ObjectId(req.body.recipientId)
    const title = req.body.title
    const content = req.body.content
    const adresser = req.body._id
    const owner = adresser

    const msg = {
      read: false,
      adresser,
      _recipientId,
      owner,
      title,
      content
    }
    const msg2 = JSON.parse(JSON.stringify(msg))
    msg2.owner = _recipientId

    const msg1Promise = await gameplay.insertMsg(msg)
    const msg2Promise = await gameplay.insertMsg(msg2)

    const result = await Promise.all([msg1Promise, msg2Promise])
    res.json({ m1: result[0], m2: result[1] })
  },
  getUnreaded: function (req, res, next) {
    msgStore
      .find({ owner: req.body._id, read: false })
      .count((err, founded) => {
        res.json({ count: founded })
      })
  },
  getMsgs: function (req, res, next) {
    msgStore
      .find({ owner: req.body._id })
      .toArray((err, results) => {
        if (err) {
          res.json(err)
        }
        else {
          res.json(results)
        }
      })
    //should send back all msgs contents
  },
  insertMsg: (msg) => {
    return new Promise((resolve) => {
      msgStore.insertOne(msg, (err, result) => {
        if (err) { resolve(err) }
        else {
          resolve(result)
        }
      })
    })
  }
}
module.exports = gameplay