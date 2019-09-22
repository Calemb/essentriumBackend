const account = require('../store/account')


const accountController = {
  GetAccountPriviliges: function (req) {
    return new Promise(resolve => {
      accounts.findOne({ _id: req.body._id }, (err, result) => {
        resolve({ err, priviliges: result.priviliges })
      })
    })
  }
}


module.exports = accountController 