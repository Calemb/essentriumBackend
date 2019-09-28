const store = require('../local_modules/store')

const travels = store.db.collection('travels')

const travel = {};

travel.find = function (id) {
  return new Promise(resolve => {
    const _id = store.ObjectId(id)
    travels.findOne({ _id }, (err, result) => {
      resolve({ err, result })
    })
  })
}

travel.upsert = function (filter, setObject) {
  return new Promise(resolve => {
    travels.updateOne(
      filter,
      { $set: setObject },
      { upsert: true },
      (err, result) => {
        resolve({ err, result })
      })
  })
}
module.exports = travel