const express = require('express')
const FtpClient = require('../../FtpClient')
const uuid = require('uuid/v4')
const router = express.Router()
const TAG = 'api.ftp'

function bindWS (server) {
  const io = require('socket.io')(server)
  const ws = io.of('/api/ftpws')
  const clients = new Map()

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
        Log.d(TAG, 'connected ' + user[0].username)
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
      try {
        const cl = client.getClient()
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
        Log.d(TAG, 'disconnect ' + sid)
      } catch (e) {
        Log.e(TAG, e)
      }
    })
  })
}

const getClient = user => {
  return clients.get(user.id)
}

function addAfterMiddleware (router) {

}

module.exports = (middleware, server) => {
  if (middleware) router.use(middleware)
  addAfterMiddleware(router)
  bindWS(server)
  return router
}
