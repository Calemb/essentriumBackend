const xtend = require('xtend')
const data = require('./config-data')

const baseConfigData = {
  pageAfterLogin: '',
  pageafterLogout: '',
  port: 80,
  socketOrigins: "",
  appOrigin: []
}

const config = xtend(baseConfigData, data)

module.exports = config