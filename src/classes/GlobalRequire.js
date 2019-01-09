const path = require('path')

module.exports = function (items) {
  for (const item in items) {
    let p
    try {
      if (/\.\//.test(items[item])) p = path.resolve(path.join(__dirname, '..', items[item]))
      else p = items[item]
      global[item] = require(p)
    } catch (e) {
      console.error(`[GlobalRequire] Could not globalize: ${item}`)
      console.error(e)
      process.exit()
    }
  }
}
