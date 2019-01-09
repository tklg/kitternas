import React from 'react'
import UnderlineInput from '../components/UnderlineInput'
import { setStateValue, saveUser } from '../actions'
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
    this.submit = this.submit.bind(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.active && !prevProps.active) {
      this.setState({
        ...this.props.user
      })
    } else if (!this.props.active && prevProps.active) {
      this.setState({
        password: '',
        password_current: ''
      })
    }
  }
  onChange (key, e) {
    this.setState({
      [key]: e.target.value
    })
  }
  submit () {
    this.props.dispatch(saveUser(this.state))
    this.setState({
      password: '',
      password_current: ''
    })
  }
  render () {
    return (
      <div className={'flex flex-container flex-center modal-container' + (this.props.active ? ' active' : '')} onClick={() => this.props.dispatch(setStateValue('userModal', false))}>
        <div className='modal flex-container flex-vertical' onClick={e => e.stopPropagation()}>
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
              pattern={/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/}
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
              <button className='btn btn-clear' onClick={() => this.submit()}>Save</button>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
