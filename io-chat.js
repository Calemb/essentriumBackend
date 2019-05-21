

const ioChat = {
  io: {},
  namespaceSockets: [],
  // citySockets:[],
  // locationSockets: [],
  players: [],
  init: function (server, config) {
    this.io = require('socket.io')(server);
    const socketAuth = require('./local_modules/socket-authorization')
    if (config.socketOrigins !== '') {
      this.io.set('origins', config.socketOrigins)
    }
    this.io.set('authorization', socketAuth);

    //read cities, guilds form server at start!

    const locationSocket = this.io.of('/location')
    locationSocket.on('connection', (socket) => {
      const socketPlayer = socket.client.request.player
      // console.log("socketname:", socketPlayer)
      const findIndex = this.players.findIndex(obj =>
        obj._id == socketPlayer._id.toString()
      )
      if (findIndex === -1) {
        this.players.push(socketPlayer)
      }
      socket.emit('list', this.players)
      socket.broadcast.emit('new-player', socketPlayer)
      socket.on('msg', (msg, callback) => {
        // FILTER CLIENTS THAT RECEIVE THIS MSG!
        // socket.broadcast.emit('msg', msg)
        socket.broadcast.emit('msg', { msg, name: socketPlayer.name })
        callback()
      })
    })
    /*
    DEV PURPOSE
    */
    this.AddNamespaceSocket('testCityName')
    this.AddNamespaceSocket('testGuildName')
    /***/
  },
  AddNamespaceSocket: function (namespaceName) {
    this.namespaceSockets[namespaceName] = this.io.of('/' + namespaceName)
    this.PrepareSocket(this.namespaceSockets[namespaceName])
  },
  RemoveNamespaceSocket: function (namespaceName) {
    delete this.namespaceSockets[namespaceName];
  },
  // AddNamespaceSocket('testGuildName')
  PrepareSocket: (newSocket) => {

    newSocket.on('connection', (socket) => {
      console.log('conntected!', socket.id)

      socket.on('msg', (msg) => {
        //FILLED ON AUTHORIZATION DATA
        // console.log(socket.client.request.name)
        // console.log('msg income: ' + msg)

        //push msg to others
        socket.broadcast.emit('msg', { msg, name: socket.client.request.name })
      })
    });
  }
}

module.exports = ioChat