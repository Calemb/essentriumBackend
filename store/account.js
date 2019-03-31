var store = require('../local_modules/store.js')

const account = {};
account.find = function (email, password, next) {
    // console.log("Find: ", email, password)
    store.db.collection('accounts')
        .findOne({
            email,
            password
        }, next)
}
module.exports = account