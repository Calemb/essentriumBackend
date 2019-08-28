var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')

var sessionCfg = require('../local_modules/session')
const config = require('../config')
/* GET users listing. */
var account = require('../store/account')

router.post('/', sessionCfg.plain, function (req, res, next) {
  var sess = req.session
  console.log(req.body)
  console.log("ciastka: " + JSON.stringify(req.cookies))
  console.log("req.sess" + JSON.stringify(sess))

  var findedAccout = account.find(req.body.email,
    req.body.password,
    (err, result) => {
      if (err) {
        console.log(err)
      }
      console.log("Result is: " + result)
      if (result) {
        sess.pass = req.body.password
        sess.email = result.email //verify with db
        res.json({
          location: config.pageAfterLogin
        }).end()
      }
      else {
        res.json({
          msg: 'wrong data',
        })
      }
    })
});

module.exports = router;
