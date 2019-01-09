import React from 'react'
import reducer from './reducers'

export default class DispatchComponent extends React.Component {
  constructor () {
    super()
    this.dispatch = this.dispatch.bind(this)
  }
  dispatch (action, cb) {
    if (!action) throw new Error('dispatch: missing action')
    if (action instanceof Function) {
      action(this.dispatch, () => this.state)
    } else {
      const changes = reducer(this.state, action)
      if (!changes || !Object.keys(changes).length) return
      this.setState({
        ...changes
      }, cb)
    }
  }
}
