const mongo = require('mongodb')
const MongoClient = mongo.MongoClient

const store = {
  db: {
    //declare collection method for further use
    collection: function (name) { }
  },
  CreateNeObjectId: function () {
    return mongo.ObjectId()
  },
  ObjectId: function (id) {
    if (typeof id !== 'object') {
      return mongo.ObjectId(id)
    }
    else {
      return id
    }
  },
  connect: function (dbAdress) {
    return new Promise((resolve, reject) => {
      const that = this
      // console.log("Connecting to mongoDB......")

      MongoClient.connect(dbAdress, function (err, client) {
        if (err) {
          resolve(err)
          // console.warn(err.message)
        }
        else {

          that.db = client

          // console.log(that);
          // console.log("Connected to DB")

          resolve(client)
        }
      })
    })
  }
}

module.exports = store
