var express = require('express');
var router = express.Router();
/* GET users listing. */

router.get('/', function (req, res, next) {
	console.log(req.sess);
    res.send('respond from login');
});

module.exports = router;
