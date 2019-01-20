const express = require('express')
const busboy = require('express-busboy')
const cookieParser = require('cookie-parser')
const api = require('./api')
const TAG = 'HttpServer'

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}

module.exports = class HttpServer {
  constructor () {
    const app = express()
    const server = require('http').Server(app)
    busboy.extend(app, {
      upload: true,
      allowedPath: /api\/ftp\/upload/
    })

    app.use(cookieParser())
    app.use(allowCrossDomain)
    app.use('/', express.static(nodePath.join(__dirname, '../../', '/public')))

    app.use('/api', api(server))

    app.get('/login', (req, res) => {
      res.sendFile(nodePath.join(__dirname, '../../', 'public/login.html'))
    })

    app.get(/.*/, (req, res) => {
      res.sendFile(nodePath.join(__dirname, '../../', 'public/index.html'))
    })

    app.use('*', (req, res) => {
      res.status(404).json({
        status: 404,
        error: `The resource '${req.originalUrl}' could not be found.`
      })
    })

    this.server = server
  }
  async listen () {
    this.server.listen(Config.port, () => {
      Log.d(TAG, `Express running on ${Config.hostname}:${Config.port}`)
    })
  }
}
