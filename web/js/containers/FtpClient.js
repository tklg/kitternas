import React from 'react'
import Filemanager from './Filemanager'
import { subscribeSocket, ftpList } from '../actions'

export default class FtpClient extends React.Component {
  constructor () {
    super()
  }
  componentDidMount () {
  }
  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.token && this.props.token) {
      subscribeSocket(this.props.dispatch, this.props.token.access_token)
    }
    if (prevProps.path !== this.props.path) {
      const parts = this.props.path
      parts.forEach((p, i, a) => {
        const path = a.filter((section, _i) => _i <= i).join('/')
        if (!this.props.directories[path]) {
          this.props.dispatch(ftpList(path))
        }
      })
    }
  }
  render () {
    return (
      <Filemanager
        path={this.props.path}
        directories={this.props.directories}
        dispatch={this.props.dispatch} />
    )
  }
}
