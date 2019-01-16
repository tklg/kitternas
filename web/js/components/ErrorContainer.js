import React from 'react'
import { clearError } from '../actions'
import './errorcontainer.scss'

const ErrorContainer = props => {
  return (
    <div className={'error-container' + (props.error ? ' active' : '')} onClick={() => props.dispatch(clearError())} >
      {props.error}
    </div>
  )
}

export default ErrorContainer
