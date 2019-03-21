var mongo = require('mongodb').MongoClient;
const store = {}

store.db = {}
store.connect = function () {
mongo.connect("mongodb://localhost/essentrium", function(err, db) {
        if (err) {
            console.warn(err.message);
        } else {
            store.db = db;
        }
    });
}
module.exports = store