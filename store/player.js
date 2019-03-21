var store = require('../local_modules/store.js')

const player = {};
player.find = function (id, next) {
    store.db.collection('players')
        .findOne({
            _id: id
        }, next)
}
module.exports = player