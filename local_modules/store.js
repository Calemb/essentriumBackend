const mongo = require('mongodb')
const MongoClient = mongo.MongoClient

const store = {
  db: {
    //declare collection method for further use
    collection: function (name) { }
  },
  ObjectId: function (id) {
    if (typeof id !== 'object') {
      return mongo.ObjectId(id)
    }
    else {
      return id
    }
  },
  connect: function () {
    const that = this
    return new Promise(resolve => {
      console.log("Connecting to mongoDB......")

      MongoClient.connect("mongodb://127.0.0.1/essentrium", function (err, client) {
        if (err) {
          resolve(err)
          console.warn(err.message)
        }
        else {

          that.db = client

          // console.log(that);
          console.log("Connected to DB")

          resolve(client)
        }
      })
    })
  }
}

module.exports = store
