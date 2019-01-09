require('./classes/GlobalRequire')({
  Log: './classes/Logger',
  nodePath: 'path',
  User: './classes/auth/User',
  AccessToken: './classes/auth/AccessToken',
  RefreshToken: './classes/auth/RefreshToken',
  CFile: '../config.json'
})
const FtpServer = require('./classes/FtpServer')
const HttpServer = require('./classes/http')

const ftpServer = new FtpServer({
  greeting: 'Connected to KitterNAS'
})
const httpServer = new HttpServer()

ftpServer.listen()
httpServer.listen()

process.on('exit', () => {
  Log.i('Exiting...')
})
