import React from 'react'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'
import { NavLink } from 'react-router-dom'
import { List, AutoSizer } from 'react-virtualized'
import './filemanager.scss'
import moment from 'moment'

function permissions2str (str) {
  let res = ''
  const regs = [/r/, /w/, /x/]
  const letters = ['r', 'w', 'x']
  for (const i in regs) {
    const reg = regs[i]
    if (reg.test(str)) res += letters[i]
    else res += '-'
  }
  return res
}
function rights2str (r) {
  return permissions2str(r.user) + permissions2str(r.group) + permissions2str(r.other)
}

function fileSize (size) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}

export default class Filemanager extends React.Component {
  constructor () {
    super()
    this.renderDirectory = this.renderDirectory.bind(this)
    this.renderDirectories = this.renderDirectories.bind(this)
    this.renderFile = this.renderFile.bind(this)
    this.listRef = React.createRef()
  }
  renderDirectories (pathArray, dirs) {
    let res = []
    res.push(this.renderDirectory('/', dirs['/']))
    pathArray.forEach((p, i, a) => {
      const path = a.filter((x, _i) => _i <= i).join('/')
      res.push(this.renderDirectory(path, dirs[path] || []))
    })
    res = res.slice(res.length - 2, res.length)
    return res
  }
  renderDirectory (path, files) {
    return (
      <div className='directory flex flex-container flex-vertical' key={path}>
        <header>{path === '/' ? 'My files' : path.split('/').reverse()[0]}</header>
        <div className='flex'>
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={this.listRef}
                className='files'
                width={width}
                height={height}
                rowCount={files.length}
                rowHeight={42}
                rowRenderer={params => this.renderFile(params, path, files)} />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
  renderFile ({ key, index, isScrolling, isVisible, style, parent }, path, files) {
    const file = files[index]
    return (
      <NavLink
        to={path === '/' ? `/${file.name}` : `/${path}/${file.name}`}
        className='file flex-container'
        key={key}
        style={style}>
        <div className='stack flex'>
          <span className='name'>{file.name}</span>
          <span className='permissions'>{file.type + rights2str(file.rights)}</span>
        </div>
        <div className='stack'>
          <span className='date'>{moment(file.date).format('ddd, MMM D [at] h:mm a')}</span>
          <span className='size'>{file.type === 'd' ? '' : `${fileSize(file.size)}`}</span>
        </div>
      </NavLink>
    )
  }
  render () {
    return (
      <div className='file-manager flex flex-container flex-vertical'>
        <Header dispatch={this.props.dispatch} />
        <Breadcrumbs path={this.props.path} />
        <div className='directory-container flex flex-container'>
          {this.renderDirectories(this.props.path, this.props.directories)}
        </div>
      </div>
    )
  }
}
