import React from 'react'
import './progress.scss'

const Progress = props => (
  <div className={'progress' + (props.bound ? ' bound' : '') + (props.working ? ' working' : '')}>
    <div className='indeterminate' />
  </div>
)

export default Progress
