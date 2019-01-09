const Client = require('promise-ftp')
const TAG = 'ftpclient'
module.exports = class FtpClient {
  constructor (uuid) {
    this.uuid = uuid
    this.client = new Client()
  }
  async connect (username, password) {
    return this.client.connect({
      user: username,
      password: password,
      autoReconnect: true,
      preserveCwd: true
    })
  }
  async end () {
    return this.client.end()
  }
  destroy () {
    return this.client.destroy()
  }
  getConnectionStatus () {
    return this.client.getConnectionStatus()
  }
  getClient () {
    return this.client
  }
}
