var session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const sessStore = new MongoStore({
    url: 'mongodb://127.0.0.1/essentrium',
    touchAfter: 24 * 3600 // time period in seconds
});

var sessionCookie = session({
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
var sessionVerify = function (req, res, next) {
    console.log('middleware sessionCOnfig')
    if (typeof req.session !== 'undefined' &&
        typeof req.session.email !== 'undefined' &&
        req.session.email !== '') {
            
        console.log(req.session.email)
        console.log('there is soe  emial set')
        next()
    }
    else {
        console.log("no session set!")
        res.status(403).json({ msg: 'session not set!' })
    }
}
var sessionsMidlewares = {}
sessionsMidlewares.strict = [sessionCookie, sessionVerify]
sessionsMidlewares.plain = [sessionCookie]
module.exports = sessionsMidlewares
