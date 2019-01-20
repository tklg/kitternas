const cFile = require('../../config.json')
const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .describe('port', 'Set the port the web server listens on')
  .alias('port', 'p')
  .argv

const config = new Proxy(cFile, {
  get: (target, prop, receiver) => {
    if (argv && argv[prop]) return argv[prop]
    return target[prop]
  }
})

module.exports = config


