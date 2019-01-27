var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  //PRAWDZIWE LOGOWANIE NASTEPUJE PONIZEJ
    var sess = req.session;
    console.log("sesja: " + sess);
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
        sess.email = 'mail@gmail.com'; // get from MONGO
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

    //render
    res.render('index', {
        title: "Witaj: " + sess.email,
        data: sess.id
    });
});

module.exports = router;
