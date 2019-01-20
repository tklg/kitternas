require('./classes/GlobalRequire')({
  nodePath: 'path',
  User: './classes/auth/User',
  AccessToken: './classes/auth/AccessToken',
  RefreshToken: './classes/auth/RefreshToken',
  Log: './classes/Logger',
  Config: './classes/Config'
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
  Log.i('KitterNAS', 'Exiting...')
})
