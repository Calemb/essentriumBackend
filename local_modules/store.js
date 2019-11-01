const mongo = require('mongodb')
const MongoClient = mongo.MongoClient

const store = {
    db: {
        //declare collection method for further use
        collection: (name) => { }
    },
    ObjectId: function (id) {
        if (typeof id !== 'object') {
            return mongo.ObjectId(id)
        }
        else {
            return id
        }
    },
    connect: function (callback) {
        console.log("Connecting to mongoDB......")

        MongoClient.connect("mongodb://127.0.0.1/essentrium", function (err, db) {
            if (err) {
                console.warn(err.message);
            } else {
                this.db = db;

                if (callback)
                    callback(this.db)
            }
        });
    }
}
store.connect((db) => {
    console.log("DB - connected")
})

module.exports = store
