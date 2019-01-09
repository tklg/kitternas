import Actions from '../actions'

const reducer = (state = {}, action) => {
  const { type, data } = action
  switch (type) {
    case Actions.set_working:
      let working = [...state.working]
      if (data.add) working.push(data.add)
      else working.splice(working.indexOf(data.remove), 1)
      return {
        working
      }
    case Actions.set_state_key:
      return {
        ...parseStateChanges(state, data)
      }
    case Actions.remove_state_array_value:
      return {
        ...removeStateArrayValue(state, data)
      }
    case Actions.add_state_array_value:
      return {
        ...addStateArrayValue(state, data)
      }
    case Actions.set_dir_content:
      let directories = { ...state.directories }
      directories[data.path] = data.files
      return {
        directories: directories
      }
  }
}

function getPWD (config, _key) {
  const cfg = { ...config }
  let pwd = cfg

  const parts = _key.split('.')
  const last = parts.pop()
  for (const part of parts) {
    let match
    let key
    let arraySearchKey = null
    let arraySearchValue
    if ((match = /^(\w+)\[(\w+)(?::\s?(\w+))?]$/.exec(part))) {
      key = match[1]
      arraySearchKey = match[2]
      arraySearchValue = match[3]
    } else if (/^\w+$/.test(part)) {
      key = part
    } else {
      throw new Error('Invalid config key string: ' + parts)
    }

    pwd = config[key]

    if (arraySearchKey !== null) { // pwd is in an array at current pwd
      if (arraySearchValue === undefined) {
        pwd = pwd[arraySearchKey]
      } else { // pwd is an object at an index of the array
        pwd = pwd.find(x => x[arraySearchKey] === arraySearchValue)
      }
    }
  }
  return {
    cfg,
    pwd,
    last
  }
}

function parseStateChanges (config, { key, value }) {
  const { cfg, pwd, last } = getPWD(config, key)
  pwd[last] = value
  return cfg
}

function removeStateArrayValue (config, { key, value }) {
  let { cfg, pwd, last } = getPWD(config, key)
  if (/^\w+\[\d+]$/.test(last)) {
    pwd = pwd[last.replace(/\[\d+]/g, '')]
    pwd.splice(+last.replace(/[^\d]/g, ''), 1)
  } else {
    pwd = pwd[last]
    pwd.splice(pwd.findIndex(x => x === value), 1)
  }
  return cfg
}

function addStateArrayValue (config, { key, value }) {
  const { cfg, pwd, last } = getPWD(config, key)
  if (!(pwd[last] instanceof Array)) throw new Error('can only add config values to arrays: ' + key)
  pwd[last].push(value)
  return cfg
}

export default reducer