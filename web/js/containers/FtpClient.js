import React from 'react'
import Filemanager from './Filemanager'
import { subscribeSocket, ftpList, ftpPreview } from '../actions'
import Util from '../lib/Util'
import { isPreviewable } from '../lib/Filetypes'

export default class FtpClient extends React.Component {
  constructor () {
    super()
    this.state = {
      loaded: 0
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.token && this.props.token) {
      subscribeSocket(this.props.dispatch, this.props.token.access_token)
    }
    if (prevProps.path.join('/') !== this.props.path.join('/') || this.state.loaded === 0) {
      // console.log('upd: ' + prevProps.path.join('/') + ' - ' + this.props.path.join('/'))
      const parts = this.props.path
      if (parts.length < 2 && !this.props.directories['/'].length) this.props.dispatch(ftpList('/'))
      parts.forEach((p, i, a) => {
        const path = Util.cleanPath(a.filter((section, _i) => _i <= i).join('/'))
        if (!this.props.directories[path]) {
          let prevPath = Util.parentPath(path)
          if (this.props.directories[prevPath] && this.props.directories[prevPath].find(f => f.name === a[a.length - 1] && f.type === '-')) {
            if (!this.props.previews[path] && isPreviewable(path)) {
              this.props.dispatch(ftpPreview(path))
            }
          } else {
            if (i >= a.length - 2) {
              this.props.dispatch(ftpList(path))
            }
          }
        }
      })
      this.setState({ loaded: 1 })
    }
  }
  render () {
    return (
      <Filemanager
        path={this.props.path}
        directories={this.props.directories}
        previews={this.props.previews}
        dispatch={this.props.dispatch} />
    )
  }
}
