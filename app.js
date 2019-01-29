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

const sessStore = new MongoStore({
    url: 'mongodb://localhost/newVall',
    touchAfter: 24 * 3600 // time period in seconds
});
var passportSocketIo = require('passport.socketio');

var app = express();
app.use(cors())
app.use(cookieParser('key cat', {}));
app.use(session({
    store: sessStore,
    secret: 'keycat',
    resave: true,
    saveUninitialized: true,
    name: 'express.sid',// -> default value is connect.sid !!!!
    key: 'express.sid',
    // cookie: {
    //     maxAge: 60000
    // }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var server = Server(app);

var io = require('socket.io')(server);

io.set('authorization', passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: 'keycat',
    store: sessStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
}));

function onAuthorizeSuccess(data, accept) {
    console.log("OK connected!");
    accept();
}

function onAuthorizeFail(data, message, error, accept) {
    console.log("go away" + error); //error is once true and once false
    if (error)
        accept(new Error(message));

    return accept(new Error(message));
}

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// app.use(express.static(path.join(__dirname, 'public')));



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
    // console.log("on connected: " + socket.handshake.foo);

    socket.on('login', function (data) {
        //data -> login and pass to future compare with DB
        console.log(data);
        console.log("**");
        //socket.request.session - undefined
        console.log(socket.request.session.views);
    });

    socket.on('linkClkEvent', function (data) {
        console.log(socket.request);
        console.log("**");
        console.log(socket.request.session);
        console.log(data);
    });
});
module.exports = app;
