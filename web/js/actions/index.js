import Ajax from '../lib/Ajax'
import uuid from 'uuid/v4'

let URL = `${window.location.origin}/api`
if (window.location.origin.indexOf('localhost') > -1) URL = 'http://localhost:8080/api'

const ACTIONS = {
  set_working: 'set_working',
  save_user: 'save_user',
  set_error: 'set_error',
  clear_error: 'clear_error',
  set_state_key: 'set_state_key',
  add_state_array_value: 'add_state_array_value',
  remove_state_array_value: 'remove_state_array_value'
}

export default ACTIONS

export const initAjax = data => (dispatch, getState) => {
  const tokens = window.localStorage.getItem('kitternas_token')
  if (!tokens) {
    window.location.href = '/login'
    return
  }
  Ajax.setTokenData({
    ...JSON.parse(tokens),
    refresh_url: URL + '/user/token'
  })
  Ajax.onRefresh((data) => {
    try {
      const tokens = JSON.parse(data)
      window.localStorage.setItem('kitternas_token', JSON.stringify(data))
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
      url: URL + '/user'
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
      url: URL + '/user',
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
