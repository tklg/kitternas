const dbp = require('../db')
const crypto = require('crypto')

module.exports = class AccessToken {
  constructor (opts) {
    this.id = -1
    this.user_id = opts.user_id
    this.token = ''

    for (const key in opts) {
      this[key] = opts[key]
    }
    this._dbfetched = false
  }
  async fetchFromDB () {
    if (this._dbfetched) return
    const db = await dbp
    
    this._dbfetched = true
  }
  async generate () {
    this.token = crypto.randomBytes(64).toString('base64')
  }
  async save () {
    const db = await dbp
    if (this.id !== -1) {
      await db.run('UPDATE access_tokens SET user_id = ?, token = ? WHERE id = ? LIMIT 1', [this.user_id, this.token, this.id])
    } else {
      let { lastID } = await db.run('INSERT INTO access_tokens (user_id, token) VALUES (?, ?)', [this.user_id, this.token])
      return lastID
    }
  }
  static async where (obj) {
    const db = await dbp
    const str = Object.keys(obj).map(x => `${x} = ?`).join(' AND ')
    const params = Object.values(obj)
    const token = await db.get(`SELECT * FROM access_tokens WHERE ${str} LIMIT 1`, params)
    if (token) return new AccessToken(token)
    else return null
  }
}
