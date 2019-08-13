var express = require('express');
var router = express.Router();
var sessionCfg = require('../local_modules/session.js')
/* GET users listing. */
var account = require('../store/account.js')

router.post('/', sessionCfg.plain, function (req, res, next) {
    var sess = req.session
    console.log(req.body)
    console.log("ciastka: " + JSON.stringify(req.cookies))
    console.log("req.sess" + JSON.stringify(sess))

    var findedAccout = account.find(req.body.email,
        req.body.password,
        (err, result) => {
            console.log("Result is: " + result)
            if (result) {
                sess.pass = req.body.password
                sess.email = result.email //verify with db
                res.json({
                    location: 'game'
                }).end()
            }
            else {
                res.json({
                    msg: 'wrong data',
                })
            }
        })


    //session verification must be in separate module and chek on every stricted request!
    //if check fail -> response 404 or sth?

    //został zainicjalizowany
    // if (sess.email) {
    // //     //TUTAJ MOGE PRZEPUSCIC REQUESTA, bo jest gracz zalogowany
    // } else {
    //     //user doesn't have registered session
    //     //need to send here login and pass 
    //     //base on those -> verify with db
    //     //set session params (like real email or sth)
    //     //from this point any restricted pages should be accesible for user

    // }

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
    // res.cookie({ name: 'key cat' })
    // res.send()
    // res.redirect('/');//to game path or StyleSheet..
    // res.sendFile(__dirname + '/game.html')
});

module.exports = router;
