const xtend = require('xtend')
const data = require('./config-data')

const baseConfigData = {
  pageAfterLogin: '',
  pageafterLogout: '',
  port: 80,
  socketOrigins: "",
  appOrigin: [],
  dbAdress: 'mongodb://127.0.0.1/essentrium'
}

const config = xtend(baseConfigData, data)

module.exports = config