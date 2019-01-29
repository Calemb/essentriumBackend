var express = require('express');
var router = express.Router();
// var sessionCfg = require('../local_modules/session.js')
/* GET users listing. */

router.get('/', function (req, res, next) {
    var sess = req.session
    console.log(req.cookies)
    console.log(sess);

    // res.send('respond from login');

    //TUTAJ USTAW ID PD GRACZA?!

    //został zainicjalizowany
    if (sess.email) {
        //TUTAJ MOGE PRZEPUSCIC REQUESTA, bo jest gracz zalogowany

        //sess.email++;
        // res.setHeader('Content-Type', 'text/html');
        // res.write('<p>views: ' + sess.views + '</p>');
        // res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
        // res.end();
    } else {
        sess.email = 'test@sess.com'; // get from MONGO
        // res.end('welcome to the session demo. refresh!');
    }

    //sztywne tworzenie ciastka
    // console.log(req.session);
    // if(req.cookies.cookieName === undefined)
    // {
    //   res.cookie('cookieName', 'myName', {maxAge: 9000, httpOnly: true});
    //   console.log('cookie just created');
    // }
    // else {
    //   console.log('cookie', req.cookies.cookieName);
    // }
    //  console.log("session: " + req.cookies.cookieName);

    res.json({ msg: sess })
});

module.exports = router;
