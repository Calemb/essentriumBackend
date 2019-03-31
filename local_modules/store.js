var mongo = require('mongodb').MongoClient;
const store = {}

store.db = {}
store.connect = (callback) => {
    mongo.connect("mongodb://127.0.0.1/essentrium", function (err, db) {
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