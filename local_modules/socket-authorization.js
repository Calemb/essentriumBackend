
const parseCookie = require('./socket-parse-cookie')
const socketAuthorization = (data, callback) => {
  const { settings } = require('./session-settings')

  console.log("Verify socket......")
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
module.exports = socketAuthorization