const store = require('../local_modules/store')
const bcrypt = require('bcrypt')

const account = {};
account.find = function (email, password, next) {
  // console.log("Find: ", email, password)
  store.db.collection('accounts')
    .findOne({
      email
    }, (err, result) => {
      if (err) {
        //some internal error - let it go
        next(err, undefined)
      }
      else {
        bcrypt.compare(password, result.password, function (err, res) {
          console.log(res)
          if (err) {
            console.log(err)
            next(err, undefined)
          }
          else if (res) {
            next(err, result)
          }
          else {
            next(err, undefined)
          }
        })
      }
    })
}
module.exports = account