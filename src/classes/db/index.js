const sqlite = require('sqlite')
const dbp = Promise.resolve()
  .then(() => sqlite.open('./db/db.sqlite'/*, { Promise }*/))
  .then(db => db.migrate({
    // force: 'last',
    migrationsPath: './db/migrations'
  }))

module.exports = dbp
