import Ajax from '../lib/Ajax'
import uuid from 'uuid/v4'
import io from 'socket.io-client'
import Util from '../lib/Util'
import { fileDragDrop } from '../lib/DirectoryScan'

let Url = `${window.location.origin}/api`
if (window.location.origin.indexOf('localhost') > -1) Url = 'http://localhost:8080/api'
const SUrl = Url + '/ftpws'
let socket

const ACTIONS = {
  set_working: 'set_working',
  save_user: 'save_user',
  set_error: 'set_error',
  clear_error: 'clear_error',
  set_state_key: 'set_state_key',
  add_state_array_value: 'add_state_array_value',
  remove_state_array_value: 'remove_state_array_value',
  set_dir_content: 'set_dir_content',
  set_preview_content: 'set_preview_content',
  add_to_upload_queue: 'add_to_upload_queue',
  remove_from_upload_queue: 'remove_from_upload_queue'
}

export default ACTIONS

const cleanPath = Util.cleanPath

export const subscribeSocket = (dispatch, token) => {
  socket = io.connect(SUrl)
  const u = uuid()
  dispatch(setWorking(u, 'add'))
  socket.emit('client.connect', { token }, res => {
    console.log(res)
    if (res.error) {
      return dispatch(setError(res.error))
    } else {
      // dispatch(ftpList('/'))
    }
    dispatch(setWorking(u, 'remove'))
  })
}

const preventListSpam = new Map()
export const ftpList = (dir) => (dispatch, getState) => {
  dir = cleanPath(dir)
  if (preventListSpam.has(dir)) return
  preventListSpam.set(dir, true)
  const u = uuid()
  dispatch(setWorking(u, 'add'))
  socket.emit('client.command', { cmd: 'list', params: [dir] }, res => {
    dispatch(setWorking(u, 'remove'))
    if (res.error) return dispatch(setError(res.error))
    console.log(res)
    dispatch(setDirectoryContent(dir, res.data))
    preventListSpam.delete(dir)
  })
}

export const ftpRename = (dir, name, newName) => (dispatch, getState) => {
  const u = uuid()
  dir = cleanPath(dir)
  dispatch(setWorking(u, 'add'))
  socket.emit('client.command', { cmd: 'rename', params: [cleanPath(dir + '/' + name), cleanPath(dir + '/' + newName)] }, res => {
    dispatch(setWorking(u, 'remove'))
    if (res.error) return dispatch(setError(res.error))
    console.log(res)
    dispatch(ftpList(dir))
  })
}

export const ftpCreate = (dir, name) => (dispatch, getState) => {
  const u = uuid()
  dir = cleanPath(dir)
  dispatch(setWorking(u, 'add'))
  socket.emit('client.command', { cmd: 'put', params: [[''], cleanPath(dir + '/' + name)] }, res => {
    dispatch(setWorking(u, 'remove'))
    if (res.error) return dispatch(setError(res.error))
    console.log(res)
    dispatch(ftpList(dir))
  })
}

export const ftpMkdir = (dir, name) => (dispatch, getState) => {
  const u = uuid()
  dir = cleanPath(dir)
  dispatch(setWorking(u, 'add'))
  socket.emit('client.command', { cmd: 'mkdir', params: [cleanPath(dir + '/' + name)] }, res => {
    dispatch(setWorking(u, 'remove'))
    if (res.error) return dispatch(setError(res.error))
    console.log(res)
    dispatch(ftpList(dir))
  })
}

export const ftpDelete = (dir) => (dispatch, getState) => {
  const u = uuid()
  dir = cleanPath(dir)
  dispatch(setWorking(u, 'add'))
  socket.emit('client.command', { cmd: 'delete', params: [dir] }, res => {
    dispatch(setWorking(u, 'remove'))
    if (res.error) return dispatch(setError(res.error))
    console.log(res)
    dispatch(ftpList(Util.parentPath(dir)))
  })
}

export const ftpPreview = (dir) => async (dispatch, getState) => {
  const u = uuid()
  try {
    dir = cleanPath(dir)
    if (preventListSpam.has(dir)) return
    preventListSpam.set(dir, true)
    dispatch(setWorking(u, 'add'))
    const { data } = await Ajax.get({
      url: Url + '/ftp/preview',
      data: {
        path: dir
      },
      responseType: 'blob'
    })
    dispatch({
      type: ACTIONS.set_preview_content,
      data: {
        path: dir,
        data: data
      }
    })
    preventListSpam.delete(dir)
  } catch (e) {
    console.error(e)
  } finally {
    dispatch(setWorking(u, 'remove'))
  }
}

export const ftpDownload = (dir) => async (dispatch, getState) => {
  const u = uuid()
  try {
    dir = cleanPath(dir)
    if (preventListSpam.has(dir)) return
    preventListSpam.set(dir, true)
    dispatch(setWorking(u, 'add'))
    const { data } = await Ajax.get({
      url: Url + '/ftp/token',
      data: {
        path: dir
      }
    })

    const a = document.createElement('a')
    a.setAttribute('download', dir.split('/').reverse()[0])
    a.href = Url + '/ftp/download?token=' + data.token
    document.querySelector('body').appendChild(a)
    a.click()
    a.remove()

    preventListSpam.delete(dir)
  } catch (e) {
    console.error(e)
  } finally {
    dispatch(setWorking(u, 'remove'))
  }
}

export const initAjax = data => (dispatch, getState) => {
  const tokens = window.localStorage.getItem('kitternas_token')
  if (!tokens) {
    window.location.href = '/login'
    return
  }
  Ajax.setTokenData({
    ...JSON.parse(tokens),
    refresh_url: Url + '/user/token'
  })
  dispatch(setStateValue('token', JSON.parse(tokens)))
  Ajax.onRefresh((data) => {
    try {
      const tokens = JSON.parse(data)
      window.localStorage.setItem('kitternas_token', JSON.stringify(data))
      dispatch(setStateValue('token', tokens))
    } catch (e) {
      dispatch(setError(e))
    }
  })
}

export const load = data => async (dispatch, getState) => {
  const u = uuid()
  try {
    dispatch(setWorking(u, 'add'))
    const { data: user } = await Ajax.get({
      url: Url + '/user'
    })
    dispatch(setStateValue('user', user))
  } catch (e) {
    dispatch(setError(e))
  } finally {
    dispatch(setWorking(u, 'remove'))
  }
}

export const setStateValue = (key, value) => ({
  type: ACTIONS.set_state_key,
  data: { key, value }
})

export const removeStateArrayValue = (key, value) => ({
  type: ACTIONS.remove_state_array_value,
  data: { key, value }
})

export const addStateArrayValue = (key, value) => ({
  type: ACTIONS.add_state_array_value,
  data: { key, value: {
    ...value,
    _id: uuid()
  }}
})

export const setWorking = (id, working) => ({
  type: ACTIONS.set_working,
  data: {
    [working]: id
  }
})

export const saveUser = user => async (dispatch, getState) => {
  const u = uuid()
  try {
    dispatch(setWorking(u, 'add'))
    const { data } = await Ajax.post({
      url: Url + '/user',
      data: {
        ...user
      },
      noProcess: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    dispatch(setStateValue('user', data))
    dispatch(setStateValue('userModal', false))
  } catch (e) {
    dispatch(setError(e))
  } finally {
    dispatch(setWorking(u, 'remove'))
  }
}

export const setError = data => ({
  type: ACTIONS.set_error,
  data: data
})

export const clearError = () => ({
  type: ACTIONS.clear_error
})

export const setDirectoryContent = (path, files) => ({
  type: ACTIONS.set_dir_content,
  data: { path, files }
})

export const addToUploadQueue = (e, path) => async (dispatch, getState) => {
  const tree = await fileDragDrop(e)
  // console.log(tree)
  dispatch({
    type: ACTIONS.add_to_upload_queue,
    data: {
      files: tree,
      path
    }
  })
}

export const upload = (item) => async (dispatch, getState) => {
  try {
    console.log(item)
    const { data } = await Ajax.post({
      url: Url + '/ftp/upload?path=' + encodeURIComponent(item.path + '/' + item.name),
      data: {
        file: item.file
      }
    })
    dispatch({
      type: ACTIONS.remove_from_upload_queue,
      data: {
        id: item.uuid
      }
    }, () => {
      dispatch(ftpList(item.path))
    })
  } catch (e) {
    dispatch(setError(e))
  } finally {

  }
}
