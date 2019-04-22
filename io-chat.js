

const ioChat = {
  io: {},
  namespaceSockets: [],
  // citySockets:[],
  // locationSockets: [],
  init: function (server) {
    this.io = require('socket.io')(server);
    const socketAuth = require('./local_modules/socket-authorization')
    this.io.set('origins', "http://127.0.0.1:3002")
    this.io.set('authorization', socketAuth);

    //read cities, guilds form server at start!

    const locationSocket = this.io.of('/location')
    locationSocket.on('connection', (socket) => {
      socket.on('msg', (msg, callback) => {
        // FILTER CLIENTS THAT RECEIVE THIS MSG!
        // socket.broadcast.emit('msg', msg)
        socket.broadcast.emit('msg', { msg, name: socket.client.request.name })
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
      console.log('conntected!')

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