const config = {
  prod: {
    port: 80,
    socketOrigins: "",
    appOrigin: []
  },
  dev: {
    port: 3001,
    socketOrigins: "http://127.0.0.1:3002",
    appOrigin: ['http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002']
  }
}


module.exports = config