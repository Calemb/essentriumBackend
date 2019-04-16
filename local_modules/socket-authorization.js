
const parseCookie = require('./socket-parse-cookie')
const account = require('../store/account')
const player = require('../store/player')
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
      console.log(session)

      if (!session) {
        callback(new Error('Socket session not found!'), false)
      } else {
        account.find(session.email, session.pass, (err, result) => {
          player.find(result._id, (err, resultPlayer) => {
            data.name = resultPlayer.name
            callback(null, true)
          })
        })
      }
    }
  })
}
module.exports = socketAuthorization