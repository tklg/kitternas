const dbp = require('../db')
const crypto = require('crypto')

module.exports = class RefreshToken {
  constructor (opts, nofetch) {
    this.id = -1
    this.user_id = opts.user_id
    this.token = ''

    for (const key in opts) {
      this[key] = opts[key]
    }
    this._dbfetched = nofetch || false
  }
  async fetchFromDB () {
    if (this._dbfetched) return
    const db = await dbp
    
    this._dbfetched = true
  }
  async generate () {
    this.token = crypto.randomBytes(128).toString('base64')
  }
  async save () {
    const db = await dbp
    if (this.id !== -1) {
      await db.run('UPDATE refresh_tokens SET user_id = ?, token = ?, access_token_id = ? WHERE id = ?', [this.user_id, this.token, this.access_token_id, this.id])
    } else {
      let { lastID } = await db.run('INSERT INTO refresh_tokens (user_id, token, access_token_id) VALUES (?, ?, ?)', [this.user_id, this.token, this.access_token_id])
      return lastID
    }
  }
  static async where (obj) {
    const db = await dbp
    const str = Object.keys(obj).map(x => `${x} = ?`).join(' AND ')
    const params = Object.values(obj)
    const token = await db.get(`SELECT * FROM refresh_tokens WHERE ${str}`, params)
    if (token) {
      if (token instanceof Array) return token.map(t => new RefreshToken(t, true))
      else return [new RefreshToken(token, true)]
    } else return null
  }
}
