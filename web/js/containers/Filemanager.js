import React from 'react'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'
import Directory from '../components/Directory'
import FilePreview from './Preview'
import Util from '../lib/Util'
import './filemanager.scss'

export default class Filemanager extends React.Component {
  constructor () {
    super()
    this.renderDirectory = this.renderDirectory.bind(this)
    this.renderFilePreview = this.renderFilePreview.bind(this)
    this.renderDirectories = this.renderDirectories.bind(this)
    this.listRef = React.createRef()
  }
  renderDirectories (pathArray, dirs, previews) {
    let res = []
    res.push(this.renderDirectory('/', dirs['/'], pathArray.length ? 0 : 1))
    pathArray.forEach((p, i, a) => {
      const path = Util.cleanPath(a.filter((x, _i) => _i <= i).join('/'))
      // let file
      if (dirs[path] || path.split('/').reverse()[0].indexOf('.') === -1) {
        res.push(this.renderDirectory(path, dirs[path] || [], i < a.length - 1 ? 0 : 1))
      } else {
        const name = path.split('/').reverse()[0]
        const parent = dirs[Util.parentPath(path)]
        if (!parent || !parent.length) return
        const file = parent.find(x => x.name === name)
        res.push(this.renderFilePreview(path, { file, data: previews[path] }, i < a.length - 1 ? 0 : 1))
      }
    })
    // res = res.slice(res.length - 2, res.length)
    return res
  }
  renderDirectory (path, files, pos) {
    return (
      <Directory path={path} files={files} pos={pos} key={path} dispatch={this.props.dispatch} />
    )
  }
  renderFilePreview (path, file, pos) {
    return (
      <FilePreview path={path} file={file} pos={pos} key={path} dispatch={this.props.dispatch} />
    )
  }
  render () {
    return (
      <div className='file-manager flex flex-container flex-vertical'>
        <Header dispatch={this.props.dispatch} />
        <Breadcrumbs path={this.props.path} />
        <div className='directory-container flex flex-container'>
          {this.renderDirectories(this.props.path, this.props.directories, this.props.previews)}
        </div>
      </div>
    )
  }
}
