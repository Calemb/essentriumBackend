const {settings, session} = require('../local_modules/session-settings')

const sessionCookie = session(settings)

module.exports = sessionCookie