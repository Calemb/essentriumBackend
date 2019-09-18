const store = require('../local_modules/store')

const player = {};
player.playersList = function () {
  return new Promise(resolve => {
    store.db.collection('players').find({}).toArray((err, result) =>
      resolve({ err, result })
    )
  })
}
player.find = function (id, next) {
  const _id = store.ObjectId(id)
  store.db.collection('players')
    .findOne({ _id }, next)
}
module.exports = player