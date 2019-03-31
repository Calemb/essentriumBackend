// http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
// http://stackoverflow.com/questions/19106861/authorizing-and-handshaking-with-socket-io

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var Server = require('http').Server;
var cors = require('cors')
var sessionCfg = require('./local_modules/session.js')
var routeTable = require('./routeTable.js')

var app = express();
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'],
  credentials: true
}))

app.use(cookieParser('keycat', {}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var server = Server(app);


//=>MAIN FRONTEND(nuxt page)
app.use('/', require('./routes/index'));

app.use('/login', require('./routes/login'));
app.use('/game', require('./routes/game'));
const gameSubDir = 'public/game/'

app.use('/game/:subGame', sessionCfg.strict,
  (req, res, next) => {
    var subGame = req.params.subGame
    console.log(routeTable[subGame])
    if (typeof routeTable[subGame] != 'undefined') {
      var routeName = routeTable[subGame] === '' ? subGame : routeTable[subGame];
      var subRoute = require('./routes/' + routeName)
      res.__dirname = path.join(__dirname, gameSubDir)
      subRoute(req, res, next)
    }
    else {
      res.json({ msg: 'not permited at routing whiteList' })
    }
  }
);

app.use('/logout', require('./routes/logout'));

app.use(express.static(path.join(__dirname, 'public/main')));
app.use(express.static(path.join(__dirname, 'public/game')));


var store = require('./local_modules/store.js')

server.listen(3000, () => {
  console.log('Listening on: ' + 3000);
  store.connect()
});
const ioChat = require('./io-chat')(server)

module.exports = app;
