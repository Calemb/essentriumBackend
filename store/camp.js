const store = require('../local_modules/store')

const camps = store.db.collection('camps')

const camp = {};

camp.find = function (filter) {
  return new Promise(resolve => {
    camps.findOne(filter, (err, result) =>
      resolve({ err, result })
    )
  })
}
camp.insert = function (ownerId, coords) {
  return new Promise(resolve => {
    camps.insertOne({
      owner: ownerId,
      coords
    }, (err, result) => {
      resolve({ err, result })
    }
    )
  })
}

module.exports = camp