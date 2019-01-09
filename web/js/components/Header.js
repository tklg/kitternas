import React from 'react'
import IconButton from './IconButton'
import { setStateValue } from '../actions'
import './header.scss'

export default props => {
  return (
    <header className='fm-header flex-container'>
      <h1 className='flex'>KitterNAS</h1>
      <div className='buttons'>
        <IconButton icon='pound' onClick={() => props.dispatch(setStateValue('userModal', true))} />
      </div>
    </header>
  )
}
