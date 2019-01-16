import React from 'react'
import { setStateValue } from '../actions'
import './contextmenu.scss'

export default class ContextMenu extends React.Component {
  constructor () {
    super()
    this.select = this.select.bind(this)
    this.tryClose = this.tryClose.bind(this)
    window.addEventListener('click', this.tryClose)
  }
  componentWillUnmount () {
    window.removeEventListener('click', this.tryClose)
  }
  tryClose (e) {
    e.stopPropagation()
    if (this.props.items) this.props.dispatch(setStateValue('contextMenu', null))
  }
  select (e, fn) {
    e.stopPropagation()
    fn()
    this.tryClose(e)
  }
  render () {
    return (
      <ul className={'contextmenu-container' + (this.props.items ? ' active' : '')} style={this.props.x ? { top: this.props.y, left: this.props.x } : null}>
        {this.props.items && this.props.items.map((item, i) => {
          if (item.spacer) return <hr key={i} />
          else return <li key={i} onClick={(e) => this.select(e, item.onClick)}>{item.react}</li>
        })}
      </ul>
    )
  }
}
