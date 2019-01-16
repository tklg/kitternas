const express = require('express')
const FtpClient = require('../../FtpClient')
const uuid = require('uuid/v4')
const router = express.Router()
const crypto = require('crypto')
const mime = require('mime-types')
const TAG = 'api.ftp'

const clients = new Map()
function bindWS (server) {
  const io = require('socket.io')(server)
  const ws = io.of('/api/ftpws')

  ws.on('connection', function (socket) {
    const client = new FtpClient(uuid())
    let sid
    socket.on('client.connect', async ({ token }, cb) => {
      try {
        const at = await AccessToken.where({ token: token })
        if (!at || !at.length) throw new Error('invalid access token')
        const user = await User.where({ id: at[0].user_id })
        const greeting = await client.connect(user[0].username, token)
        clients.set(user[0].id, { client, socket })
        sid = user[0].id
        // Log.d(TAG, 'connected ' + user[0].username)
        cb({
          status: 'ok',
          data: greeting
        })
      } catch (e) {
        cb({
          error: e.message
        })
      }
    })

    socket.on('client.command',  async ({ cmd, params }, cb) => {
      if (sid === undefined) return socket.disconnect()
      try {
        const cl = client.getClient()
        // Log.d(TAG, params)
        const res = await cl[cmd](...params)
        cb({
          status: 'ok',
          data: res
        })
      } catch (e) {
        cb({
          error: e.message
        })
      }
    })

    socket.on('disconnect', () => {
      if (sid === undefined) return
      try {
        client.destroy()
        clients.delete(sid)
        // Log.d(TAG, 'disconnect ' + sid)
      } catch (e) {
        Log.e(TAG, e)
      }
    })
  })
}

const getClient = user => {
  return clients.get(user.id)
}

const downloadTokens = new Map()

function addAfterMiddleware (router) {
  router.get('/preview', async (req, res) => {
    const client = clients.get(res.locals.user.id)
    if (!client) return res.status(404).json({
      error: 'no ftp client found'
    })
    let path = req.query.path
    if (!path) return res.status(400).json({
      error: 'missing path'
    })
    path = path.replace(/\.\.\/?/g, '')
    res.writeHead(200, {
      'Content-Type': mime.contentType(nodePath.extname(path)) || 'application/octet-stream'
    })
    // res.set()
    const stream = await client.client.getClient().get(path)
    stream.on('end', () => res.end())
    stream.on('error', () => res.end())
    stream.pipe(res)
  })

  router.get('/token', async (req, res) => {
    let path = req.query.path
    if (!path) return res.status(400).json({
      error: 'missing path'
    })
    path = path.replace(/\.\.\/?/g, '')
    const token = crypto.randomBytes(32).toString('hex')
    downloadTokens.set(token, { user: res.locals.user.id, path: path })
    res.status(200).json({
      token: token
    })
  })

  router.get('/download', async (req, res) => {
    const token = req.query.token
    if (!token) return res.status(400).json({
      error: 'missing token'
    })
    if (!downloadTokens.has(token)) return res.status(403).json({
      error: 'invalid token'
    })
    const tokData = downloadTokens.get(token)
    const client = clients.get(tokData.user)
    if (!client) return res.status(404).json({
      error: 'no ftp client found'
    })
    const path = tokData.path
    // res.set()
    const size = await client.client.getClient().size(path)
    const stream = await client.client.getClient().get(path)
    res.writeHead(200, {
      'Content-Type': mime.contentType(nodePath.extname(path)) || 'application/octet-stream',
      'Content-Length': size,
      'Content-Disposition': 'attachment; filename="' + (path.split('/').reverse()[0] || 'unknown filename') + '"'
    })
    stream.on('end', () => res.end())
    stream.on('error', () => res.end())
    downloadTokens.delete(token)
    stream.pipe(res)
  })

  router.post('/upload', async (req, res) => {
    const client = clients.get(res.locals.user.id)
    if (!client) return res.status(404).json({
      error: 'no ftp client found'
    })
    let path = req.query.path
    if (!path) return res.status(400).json({
      error: 'missing path'
    })
    path = decodeURIComponent(path.replace(/\.\.\/?/g, ''))

    if (!req.files || !req.files.file) return res.status(400).json({
      error: 'missing file'
    })
    await client.client.getClient().put(req.files.file.file, path)
    res.status(200).json({
      message: 'uploaded ' + path
    })
  })
}

module.exports = (middleware, server) => {
  if (middleware) router.use(middleware)
  addAfterMiddleware(router)
  bindWS(server)
  return router
}
