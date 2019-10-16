const store = require('../local_modules/store')
const players = store.db.collection('players')

const player = {};
player.playersList = function () {
  return new Promise(resolve => {
    players.find({}).toArray((err, result) =>
      resolve({ err, result })
    )
  })
}
player.find = function (id, next) {
  const _id = store.ObjectId(id)
  players.findOne({ _id }, next)
}
player.updateOne = function (filter, data) {
  return new Promise(resolve => {
    players.updateOne(filter, data, resolve)
  })
}
module.exports = player