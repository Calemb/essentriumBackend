const store = require('../local_modules/store')
const xtend = require('xtend')
const msgStore = store.db.collection('messages')
//bussines object!
//ASSUME msgs after send is unreaded
//msg could be sended
//getMsgs give back sended & received msgs
const gameplay = {
  markReaded: function (req, res, next) {
    const id = store.ObjectId(req.body.id)

    msgStore.updateOne({ _id: id, _recipientId: req.body._id }, {
      $set: {
        read: true
      }
    },
      (err, result) => {
        res.json({ err, result })
      })
  },
  sendMsg: async function (req, res, next) {
    const _recipientId = store.ObjectId(req.body.recipientId)
    const title = req.body.title
    const content = req.body.content
    const _adresserId = req.body._id
    const owner = _adresserId

    const msg = {
      _adresserId,
      _recipientId,
      owner,
      title,
      content
    }
    const msg2 = xtend(msg, { owner: _recipientId, read: false })

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