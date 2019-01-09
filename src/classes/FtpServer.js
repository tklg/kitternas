const { FtpSrv, FileSystem } = require('ftp-srv')
const bunyan = require('bunyan') // required from ftp-srv
const TAG = 'FtpServer'

module.exports = class FtpServer {
  constructor (opts) {
    const quietLog = bunyan.createLogger({
      name: 'quiet',
      level: 60
    })
    const ftpServer = new FtpSrv({
      log: quietLog,
      ...opts
    })

    this.server = ftpServer
    this.bindEvents()
  }
  bindEvents () {
    this.server.on('login', async ({ connection, username, password }, resolve, reject) => {
      try {
        let user = new User({ username, password })
        let valid = await user.login()
        if (!valid) {
          const at = await AccessToken.where({ token: password })
          if (at) {
            user = await User.where({ id: at[0].user_id })
            if (user && user[0].username === username) {
              valid = true
            }
          }
        }
        if (valid) {
          const rootPath = process.cwd()
          const fs = new FileSystem(connection, {
            root: rootPath,
            cwd: undefined
          })
          const blacklist = []
          const whitelist = undefined
          resolve({ fs, blacklist, whitelist })
        } else {
          throw new Error('Invalid credentials')
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  async listen () {
    await this.server.listen()
    Log.d(TAG, 'FTP server listening')
  }
}
