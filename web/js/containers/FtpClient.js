import React from 'react'
import Filemanager from './Filemanager'
import { subscribeSocket } from '../actions'

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
  }
  render () {
    return (
      <Filemanager path={this.props.path} dispatch={this.props.dispatch} />
    )
  }
}
