const dbp = require('../db')
const bcrypt = require('bcrypt')

module.exports = class User {
  constructor (opts, nofetch) {
    this.id = -1
    this.username = opts.username
    this.password = opts.password
    this.hashedPassword = opts.password
    this.email = opts.email
    for (const key in opts) {
      this[key] = opts[key]
    }
    this._dbfetched = nofetch || false
    if (!nofetch && (this.username || this.email)) {
      this.fetchFromDB().catch(e => {
        
      })
    }
  }
  async fetchFromDB () {
    if (this._dbfetched) return
    const db = await dbp
    let user
    if (this.email) {
      user = await db.get('SELECT * FROM users WHERE email = ? LIMIT 1', [this.email])
      if (!user) throw new Error('Cannot find user with email: ' + this.email)
    } else {
      user = await db.get('SELECT * FROM users WHERE username = ? LIMIT 1', [this.username])
      if (!user) throw new Error('Cannot find user with username: ' + this.username)
    }
    this.id = user.id
    this.hashedPassword = user.password
    this.username = user.username
    this.email = user.email
    this._dbfetched = true
  }
  async login (password) {
    await this.fetchFromDB()
    const matches = await bcrypt.compare(password || this.password, this.hashedPassword)
    return matches
  }
  async setPassword (str) {
    const hashedPassword = await bcrypt.hash(str, 10)
    this.hashedPassword = hashedPassword
  }
  async save () {
    const db = await dbp
    let lastID
    if (this.id !== -1) {
      await db.run('UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?', [this.email, this.username, this.hashedPassword, this.id])
    } else {
      { lastID } await db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [this.email, this.username, this.hashedPassword])
    }
    return lastID
  }
  static async where (obj) {
    const db = await dbp
    const str = Object.keys(obj).map(x => `${x} = ?`).join(' AND ')
    const params = Object.values(obj)
    const user = await db.get(`SELECT * FROM users WHERE ${str}`, params)
    if (user) {
      if (user instanceof Array) return user.map(u => new User(u, true))
      else return [new User(user, true)]
    } else return null
  }
  static async all () {
    const db = await dbp
    const users = await db.get(`SELECT * FROM users`)
    if (users) {
      if (users instanceof Array) return users.map(u => new User(u, true))
      else return [new User(users, true)]
    } else return []
  }
}
