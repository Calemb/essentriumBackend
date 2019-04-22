var account = require('../store/account.js')

var sessionCookie = require('./session-cookie.js')

var sessionVerify = function (req, res, next) {
    req.session.email = 'fake@gmail.com';
    req.session.email = 'calemb@gmail.com';
    req.session.pass = '1234';
    console.log('session.js JUST inject fake session data!!!!!');

    console.log('middleware sessionCOnfig')
    if (typeof req.session !== 'undefined' &&
        typeof req.session.email !== 'undefined' &&
        req.session.email !== '') {
        // console.table(req.session)
        account.find(req.session.email, req.session.pass,
            (err, result) => {
                // console.table(result)
                if (err) { res.json(err) }
                req.body._id = result._id
                console.log('there is session', result._id)
                next()
            })

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
