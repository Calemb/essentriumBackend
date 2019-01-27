// http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
// http://stackoverflow.com/questions/19106861/authorizing-and-handshaking-with-socket-io

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var Server = require('http').Server;
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const sessStore = new MongoStore({
    url: 'mongodb://localhost/newVall',
    touchAfter: 24 * 3600 // time period in seconds
});
var passportSocketIo = require('passport.socketio');

var app = express();
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

// io.use(function(socket, next) {
//SPRAWDZ CZY cookie id pasuje do tego z sessji nawiązanej przez express session
//JEZELI PASUJE TO MOZEMY NAWIAZAC POLACZENIE




// console.log("**");
// console.log("handshake: " + socket.request.headers.cookie);


// console.log("**");
//     next();
// });
// io.set('authorization', function(handshake, callback) {
//     console.log(handshake)
//      handshake.foo = "myFoo";
//      callback(null, true);
// });
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
// var sessionMiddleware = session({
//     store: new RedisStore({}),
//     name: 'sess.sid',
//     cookie: {
//         domain: 'localhost',
//         maxAge: 1000 * 60 * 60 * 172800
//     }
// });



// io.use(function(socket, next) {
//     sessionMiddleware(socket.request, socket.request.res, next);
// });

// app.get('/', function(req, res, next) {
//     var sess = req.session;
//     console.log("sesja: " + sess);
//
//     if (sess.views) {
//         sess.views++;
//         res.setHeader('Content-Type', 'text/html');
//         res.write('<p>views: ' + sess.views + '</p>');
//         res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
//         res.end();
//     } else {
//         sess.views = 1;
//         res.end('welcome to the session demo. refresh!');
//     }
// });
app.use('/', require('./routes/index'));
// app.use('/login', require('./routes/login'));
// app.use('/logout', require('./routes/logout'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));



var mongo = require('mongodb').MongoClient;
var myDb;



server.listen(3000, function() {
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
io.on('connection', function(socket) {
    // console.log("on connected: " + socket.handshake.foo);

    socket.on('login', function(data) {
        //data -> login and pass to future compare with DB
        console.log(data);
        console.log("**");
        //socket.request.session - undefined
        console.log(socket.request.session.views);
    });

    socket.on('linkClkEvent', function(data) {
        console.log(socket.request);
        console.log("**");
        console.log(socket.request.session);
        console.log(data);
    });
});
module.exports = app;
