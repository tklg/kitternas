import React from 'react'
import { setStateValue } from '../actions'
import UnderlineInput from '../components/UnderlineInput'
import './modal.scss'

export default class ConfirmationModal extends React.Component {
  constructor () {
    super()
    this.cancel = this.cancel.bind(this)
    this.submit = this.submit.bind(this)
    this.setValue = this.setValue.bind(this)
    this.state = {
      content: null
    }
    this.iRef = React.createRef()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.content && !this.props.content) {
      this.setState({
        content: prevProps.content
      })
    } else if (!prevProps.content && this.props.content) {
      this.setState({
        content: this.props.content
      }, () => {
        if (!this.iRef.current) return
        if (this.state.content.value) this.iRef.current.select()
        else this.iRef.current.focus()
      })
    }
  }
  cancel (e) {
    this.props.dispatch(setStateValue('confirmationModal', null))
  }
  submit (e) {
    if (e.keyCode && e.keyCode !== 13) return
    this.props.content.onSubmit(e, this.state.content.value || undefined)
    this.props.dispatch(setStateValue('confirmationModal', null))
  }
  setValue (e) {
    this.setState({
      content: {
        ...this.state.content,
        value: e.target.value
      }
    })
  }
  render () {
    return (
      <div className={'flex flex-container flex-center modal-container' + (this.props.content ? ' active' : '')} onClick={() => this.props.dispatch(setStateValue('confirmationModal', null))}>
        <div className='modal flex-container flex-vertical' onClick={e => e.stopPropagation()}>
          {this.state.content && <header>
            <h1>{this.state.content.header}</h1>
          </header>}
          {this.state.content && this.state.content.body && <div className='modal-body'>
            {this.state.content.body}
          </div>}
          {this.state.content && this.state.content.value !== undefined &&
            <UnderlineInput 
              type='text'
              value={this.state.content.value}
              onChange={this.setValue}
              onKeyDown={this.submit}
              refPass={this.iRef}
            />
          }
          {this.state.content && <footer>
            <div className='buttons'>
              <button className='btn btn-clear' onClick={(e) => this.cancel(e)}>{this.state.content.cancelLabel || 'Cancel'}</button>
              <button className='btn' onClick={(e) => this.submit(e)}>{this.state.content.submitLabel || 'OK'}</button>
            </div>
          </footer>}
        </div>
      </div>
    )
  }
}
