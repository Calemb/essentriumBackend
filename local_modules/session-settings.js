const cookieParserer = require('cookie-parser');
const session = require('express-session')
const sessStore = require('./session-store.js')(session)

const settings = {
  cookieParser: cookieParserer,
  store: sessStore,
  secret: 'keycat',
  resave: true,
  saveUninitialized: true,
  name: 'express.sid',// -> default value is connect.sid !!!!
  key: 'express.sid',
  // cookie: {
  //     maxAge: 60000
  // }
}
module.exports = { settings, session }