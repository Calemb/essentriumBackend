// http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
// http://stackoverflow.com/questions/19106861/authorizing-and-handshaking-with-socket-io

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var Server = require('http').Server;
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cors = require('cors')
var sessionCfg = require('./local_modules/session.js')
var routeTable = require('./routeTable.js')
const sessStore = new MongoStore({
  url: 'mongodb://127.0.0.1/essentrium',
  touchAfter: 24 * 3600 // time period in seconds
});
var app = express();
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'],
  credentials: true
}))

app.use(cookieParser('keycat', {}));
// app.use(ownSession);

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

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public/main')));
app.use(express.static(path.join(__dirname, 'public/game')));


var store = require('./local_modules/store.js')

server.listen(3000, () => {
  console.log('Listening on: ' + 3000);
  store.connect()
});
const parseCookie = (auth, cookieHeader) => {
  var cookieParser = auth.cookieParser(auth.secret);
  var req = {
    headers: {
      cookie: cookieHeader
    }
  };
  var result;
  cookieParser(req, {}, function (err) {
    if (err) throw err;
    result = req.signedCookies || req.cookies;
  });
  return result;
}
var io = require('socket.io')(server);
io.set('authorization',
  (data, callback) => {
    const settings = {
      cookieParser: cookieParser,
      resave: true,
      saveUninitialized: true,
      key: 'express.sid',
      secret: 'keycat',

      store: sessStore,
      name: 'express.sid'
    }

    var parsed = parseCookie(settings, data.headers.cookie)[settings.key]
    settings.store.get(parsed, (err, session) => {
      if (err) {
        console.log(err)
        callback(new Error(err), false)
      }
      else {
        // console.log(session)

        if (!session) {
          callback(new Error('Socket session not found!'), false)
        }
        else {
          callback(null, true)
        }
      }
    })
  }
);
io.on('connection', (socket) => {
  console.log('socket connected!')
  socket.on('msg', (arg, func) => {
    //func make callback to frontend
    console.log("SOcket log me sth");
    console.log(arg);
    // console.log(socket.request);
    // console.log("**");
    // console.log(socket.request.session);
    // console.log(data);
    //     socket.on('ferret', function (name, word, fn) {
    // fn(name + ' says ' + word);
    // });
  });
});
module.exports = app;
