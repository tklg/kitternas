import React from 'react'
import { NavLink } from 'react-router-dom'
import './breadcrumbs.scss'

function getHeaderText (str, props) {
  return str
}

function getHeaderHref (a, i) {
  const str = a.length ? '/' + a.filter((x, _i) => _i <= i).join('/').toLowerCase() : '/'
  return str
}

export default props => {
  let path = props.path.reduce((a, x) => {
    // if (!/^\d+$/.test(a[a.length - 1])) a.push(x)
    a.push(x)
    return a
  }, []).map((p, i, a) => {
    return {
      text: getHeaderText(p, props),
      href: getHeaderHref(a, i)
    }
  }).map((p, i) => {
    return <NavLink to={p.href} key={`a-${i}`}>{p.text}</NavLink>
  })
  path.unshift(<NavLink to={'/'} key={'a'}>{'My files'}</NavLink>)
  path = path.reduce((r, e, i, a) => {
    r.push(e)
    if (i < a.length - 1) r.push(<span key={`span-${i}`}> / </span>)
    return r
  }, [])
  return (
    <nav className='breadcrumbs'>{path}</nav>
  )
}
