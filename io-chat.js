
const ioChat = (server) => {


  var io = require('socket.io')(server);
  const socketAuth = require('./local_modules/socket-authorization')
  // io.origins("http://127.0.0.1:3002")
  io.set('origins', "http://127.0.0.1:3002")
  io.origins((origin, callback) => {
    console.log(origin)

    callback(null, true)
  })
  io.set('authorization', socketAuth);

  const ioLocation = io.of('/location')
  const ioCity = io.of('/testCityName')
  const ioGuild = io.of('/testGuildName')

  ioGuild.on('connection', (socket) => {
    console.log('conntected!')

    socket.on('msg', (msg) => {
      console.log('msg income: ' + msg)
      socket.broadcast.emit('msg', msg)
    })
  });
  // ioGuild.on('connection', (socket) => {
  //   console.log("SOCKET id: " + socket.id)
  //   // console.log(socket.handshake)
  //   // ioGuild
  //   socket.on('msg', function (a, fn) {
  //     console.table("Da: ")
  //   });

  //   socket.on('disconnect', (reason) => {
  //     console.log("discon: " + reason)
  //   })

  //   socket.emit('msg', { msg: 'test' })//broadcast.emit?
  //   console.log('connected with testGuildName socket');
  // })

  ioCity.on('connection', (socket) => {

    console.log('connected with testCityName socket');
  })

  ioLocation.on('connection', (socket) => {
    console.log('connected with Location socket');
  });

}

module.exports = ioChat