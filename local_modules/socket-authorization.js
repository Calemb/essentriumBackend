
const parseCookie = require('./socket-parse-cookie')
const account = require('../store/account')
const player = require('../store/player')
const socketAuthorization = (data, callback) => {
  const { settings } = require('./session-settings')

  const parsedCookie = parseCookie(settings, data.headers.cookie)[settings.key]
  settings.store.get(parsedCookie, (err, session) => {
    if (err) {
      console.log(err)
      callback(new Error(err), false)
    }
    else {
      // console.log(session)

      if (!session) {
        callback(new Error('Socket session not found!'), false)
      } else {
        account.find(session.email, session.pass, (err, result) => {
          if (err) {
            callback(new Error(err), false)
          }
          else if (result) {
            player.find(result._id, (err, resultPlayer) => {
              data.player = { _id: result._id.toString(), name: resultPlayer.name }
              callback(null, true)
            })
          } else {
            callback(new Error({ msg: 'account not found' }), false)
          }
        })
      }
    }
  })
}
module.exports = socketAuthorization