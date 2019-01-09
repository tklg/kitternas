import React from 'react'
import UnderlineInput from '../components/UnderlineInput'
import './modal.scss'

export default class UserModal extends React.Component {
  constructor () {
    super()
    this.state = {
      username: '',
      email: '',
      password: '',
      password_current: ''
    }
    this.onChange = this.onChange.bind(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.active && !prevProps.active) {
      this.setState({
        ...this.props.user
      })
    }
  }
  onChange (key, e) {
    this.setState({
      [key]: e.target.value
    })
  }
  render () {
    return (
      <div className={'flex flex-container flex-center modal-container' + (this.props.active ? ' active' : '')}>
        <div className='modal flex-container flex-vertical'>
          <header>
            <h1>User settings</h1>
          </header>
          <div className='modal-body'>
            <UnderlineInput
              type='text'
              placeholder='Username'
              value={this.state.username}
              onChange={e => this.onChange('username', e)} />
            <UnderlineInput
              type='text'
              placeholder='Email'
              value={this.state.email}
              onChange={e => this.onChange('email', e)} />
            <UnderlineInput
              type='password'
              placeholder='Password'
              value={this.state.password}
              onChange={e => this.onChange('password', e)} />
            <UnderlineInput
              type='password'
              placeholder='Current password'
              value={this.state.password_current}
              onChange={e => this.onChange('password_current', e)} />
          </div>
          <footer>
            <div className='buttons'>
              <button className='btn btn-clear'>Save</button>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
