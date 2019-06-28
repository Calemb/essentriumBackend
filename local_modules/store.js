const mongo = require('mongodb')
const MongoClient = mongo.MongoClient

const store = {}
store.db = {}
store.ObjectId = (id) => {
    return mongo.ObjectId(id)
}
store.connect = (callback) => {
    MongoClient.connect("mongodb://127.0.0.1/essentrium", function (err, db) {
        if (err) {
            console.warn(err.message);
        } else {
            store.db = db;
            if (callback)
                callback(db)
        }
    });
}
module.exports = store