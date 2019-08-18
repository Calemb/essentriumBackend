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
const chalk = require('chalk')
var app = express();

const config = require('./config')
if (config.appOrigin.length > 0) {
  app.use(cors({
    origin: config.appOrigin,
    credentials: true
  }))
}

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
app.get('/news', (req, res, next) => {
  const gameplay = require('./gameplay/admin/news')
  gameplay.get(req, res, next)
})

const gameSubDir = 'public/game/'
//WORKING frontend talking to 'api' url, cause we want have api & page calls separated!
app.use('/api/game/:subGame', sessionCfg.strict,
  (req, res, next) => {
    var subGame = req.params.subGame
    console.log(routeTable[subGame])
    console.log(chalk.green("subGame: " + subGame))
    if (typeof routeTable[subGame] != 'undefined') {
      var routeName = routeTable[subGame] === '' ? subGame : routeTable[subGame];
      var subRoute = require('./routes/' + routeName)
      res.__dirname = path.join(__dirname, gameSubDir)
      subRoute(req, res, next)
    }
    else {
      console.log(chalk.red(req.originalUrl + ' -> not permitted at routing whiteList'))
      res.json({ msg: 'not permited at routing whiteList' })
    }
  }
);

app.use('/logout', require('./routes/logout'));

app.use(express.static(path.join(__dirname, 'public/main')));
app.use(express.static(path.join(__dirname, 'public/game')));


var store = require('./local_modules/store.js')
const port = config.port

server.listen(port, () => {
  console.log('Listening on: ' + port);
  store.connect()
});
const ioChat = require('./io-chat')
ioChat.init(server, config)

module.exports = app;
