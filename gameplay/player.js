const store = require('../local_modules/store')
const player = store.db.collection('players')

const gameplay = {
  idToName: function (playerId, callback) {
    player.findOne({ _id: store.ObjectId(playerId) }, callback)
  }
}


module.exports = gameplay