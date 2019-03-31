const ConnectMongo = require('connect-mongo')

const sessStore = function (session) {
  this.store
  this.MongoStore

  if (!this.store) {
    this.MongoStore = ConnectMongo(session)
    
    this.store = new MongoStore({
      url: 'mongodb://127.0.0.1/essentrium',
      touchAfter: 24 * 3600 // time period in seconds
    })
  }
  return this.store
}

module.exports = sessStore