import React from 'react'
import './underlineinput.scss'

const UnderlineInput = ({type, name, value, pattern, onChange, onBlur, placeholder, refPass, ...props}) => (
  <div className={'underlined-input ' + (props.className ? props.className : '')}>
    <input
      type={type}
      name={name}
      value={value}
      className={(value.length ? 'has-content' : '') + (pattern
        ? (value.length && !pattern.test(value) ? ' invalid' : '')
        : '')}
      autoComplete='nothing'
      onChange={onChange}
      onBlur={onBlur}
      ref={refPass}
      {...props} />
    <div className='reacts-to'>
      <label className='placeholder'>{placeholder}</label>
      <div className='underline' />
    </div>
  </div>
)

export default UnderlineInput
