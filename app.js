// http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
// http://stackoverflow.com/questions/19106861/authorizing-and-handshaking-with-socket-io

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var Server = require('http').Server;
// var session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
var cors = require('cors')
var sessionCfg = require('./local_modules/session.js')
var routeTable = require('./routeTable.js')
// const sessStore = new MongoStore({
//     url: 'mongodb://127.0.0.1/essentrium',
//     touchAfter: 24 * 3600 // time period in seconds
// });
// var passportSocketIo = require('passport.socketio');

var app = express();
app.use(cors({
    origin: 'http://127.0.0.1:3001',
    credentials: true
}))

app.use(cookieParser('keycat', {}));
// app.use(ownSession);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var server = Server(app);

var io = require('socket.io')(server);
// io.set('authorization', function(handshake, accept){
//     // console.log(handshake);
//     accept()
// })
// io.set('authorization', passportSocketIo.authorize({
//     cookieParser: cookieParser,
//     key: 'express.sid',
//     secret: 'keycat',
//     store: sessStore,
//     // name: 'express.sid',
//     success: onAuthorizeSuccess,
//     fail: onAuthorizeFail,
// }));

// function onAuthorizeSuccess(data, accept) {
//     // console.log(data)
//     console.log("OK connected!");
//     accept();
// }

function onAuthorizeFail(data, message, error, accept) {
    // console.log(data)
    console.log("go away: " + error); //error is once true and once false
    if (error)
        accept(new Error(message));

    return accept(new Error(message));
}

//=>MAIN FRONTEND(nuxt page)
app.use('/', require('./routes/index'));

app.use('/login', require('./routes/login'));
app.use('/game', require('./routes/game'));
const gameSubDir = 'public/game/game'

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


var mongo = require('mongodb').MongoClient;
var myDb;



server.listen(3000, function () {
    console.log('Listening on: ' + 3000);
    //localhost/dbName
    // mongo.connect("mongodb://localhost/test", function(err, db) {
    //     if (err) {
    //         console.warn(err.message);
    //     } else {
    //         myDb = db;
    //     }
    // });
});
io.on('connection', function (socket) {
    var cookie_string = socket.request.headers.cookie;
    console.log(cookie_string)//here in cookie I get express sid
    //link it to session storage and validate if there si email set?! or before on auth 
    // console.log("on connected: " + JSON.stringify(socket.handshake));
    // // console.log("on connected: " + JSON.stringify(socket.request));
    // console.log("on connected: " + JSON.stringify(socket.cookie));

    // socket.on('login', function (data) {
    //     //data -> login and pass to future compare with DB
    //     console.log(data);
    //     console.log("**");
    //     //socket.request.session - undefined
    //     console.log(socket.request);
    // });

    socket.on('msg', function (arg, func) {
        //func make callback to frontend
        console.log("SOcket log me sth");
        console.log(arg);
        func(arg + "as")
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
