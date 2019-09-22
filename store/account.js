const store = require('../local_modules/store')
const bcrypt = require('bcrypt')

const account = {};
// account.find
account.find = function (email, password, next) {
  // console.log("Find: ", email, password)
  store.db.collection('accounts')
    .findOne({
      email
    }, (err, result) => {
      console.log({ err }, result);

      if (err) {
        console.log('Account search fail');

        //some internal error - let it go
        next(err, undefined)
      }
      else if (result) {
        //email is valid, compare passwords....
        bcrypt.compare(password, result.password, function (err, res) {
          // console.log(res)
          if (err) {
            console.log('Error: ', err)
            next(err, undefined)
          }
          else if (res) {
            console.log('Find account');

            next(err, result)
          }
          else {
            console.log('Nothing found');

            next(err, undefined)
          }
        })
      } else {
        console.log('Fail at all account searching');

        next(err, undefined)
      }
    })
}
module.exports = account