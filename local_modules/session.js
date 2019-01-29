var session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const sessStore = new MongoStore({
    url: 'mongodb://localhost/newVall',
    touchAfter: 24 * 3600 // time period in seconds
});

var sessionCfg = session({
    store: sessStore,
    secret: 'keycat',
    resave: true,
    saveUninitialized: true,
    name: 'express.sid',// -> default value is connect.sid !!!!
    key: 'express.sid',
    // cookie: {
    //     maxAge: 60000
    // }
})

module.exports = sessionCfg
