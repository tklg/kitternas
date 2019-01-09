const chalk = require('chalk')

function generateString (level, tag, msg) {
  const colors = [chalk.blueBright, chalk.yellowBright, chalk.redBright, chalk.greenBright]
  const color = colors[['D', 'W', 'E', 'I'].indexOf(level)]
  if (!msg) {
    msg = tag
    tag = '?'
  }
  if (msg instanceof Error && msg.stack) msg = msg.stack
  try { if (typeof msg !== 'string') msg = stringify(msg, null, 2) } catch (e) {}
  return `[${chalk.magentaBright((new Date()).toISOString())}] ${color(`${level}/${tag}`)}: ${msg.toString()}`
}

class Log {
  static d (tag, msg) {
    console.log(generateString('D', tag, msg))
  }
  static w (tag, msg) {
    console.warn(generateString('W', tag, msg))
  }
  static e (tag, msg) {
    console.error(generateString('E', tag, msg))
  }
  static i (tag, msg) {
    console.info(generateString('I', tag, msg))
  }
}

function stringify(str, html) {
  const cache = []
  return JSON.stringify(str, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return '[Circular]'
      }
      cache.push(value)
    }
    return value
  }, 2)
}

module.exports = Log
