import React from 'react'
import IconButton from '../components/IconButton'
import { setStateValue, ftpPreview, ftpRename, ftpDelete, ftpDownload } from '../actions'
import { isPreviewable, getPreviewType, getType, getExt } from '../lib/Filetypes'
import Util from '../lib/Util'

function blobToString (b) {
  let u, x;
  u = URL.createObjectURL(b)
  x = new XMLHttpRequest()
  x.open('GET', u, false)
  x.send()
  URL.revokeObjectURL(u)
  return x.responseText
}

export default class Preview extends React.Component {
  constructor () {
    super()
    this.getPreview = this.getPreview.bind(this)
  }
  getPreview () {
    if ((!this.props.file || !this.props.file.data) && isPreviewable(this.props.file.file.name)) return <div />
    const file = this.props.file.file
    const ext = getExt(file.name)
    switch (getPreviewType(file.name)) {
      case 'image': return <img className='media' src={URL.createObjectURL(this.props.file.data)} />
      case 'video': return <video className='media' controls src={URL.createObjectURL(this.props.file.data)} />
      case 'audio': return <audio controls src={URL.createObjectURL(this.props.file.data)} />
      case 'pdf': return <embed className='full' src={URL.createObjectURL(this.props.file.data)} />
      case 'text': return <textarea className='full' readonly value={blobToString(this.props.file.data)} />
      default: return <div className='nopreview flex-container flex-center'><span>{`.${ext}`}</span></div>
    }
  }
  render () {
    const path = Util.cleanPath(this.props.path)
    const name = this.props.file.file.name
    return (
      <div className={'directory preview flex flex-container flex-vertical' + (` position-${this.props.pos}`)}>
        <header className='flex-container'>
          <span className='flex'>{this.props.file.file.name}</span>
           <div className='buttons flex-none'>
            <IconButton icon='square-edit-outline' onClick={() => this.props.dispatch(setStateValue('confirmationModal', {
              header: `Rename ${name}`,
              submitLabel: 'Rename',
              value: name,
              onSubmit (e, value) {
                const prevPath = Util.parentPath(path)
                console.log('edit ' + prevPath + ' to ' + value)
                dispatch(ftpRename(prevPath, name, value))
              }
            }))} />
            <IconButton icon='delete' onClick={() => this.props.dispatch(setStateValue('confirmationModal', {
              header: `Delete ${name}?`,
              submitLabel: 'Delete',
              onSubmit () {
                console.log('delete: ' + path)
                dispatch(ftpDelete(path))
              }
            }))} />
            <IconButton icon='download' onClick={() => this.props.dispatch(ftpDownload(path))} />
            <IconButton icon='folder-move' onClick={() => this.props.dispatch()} />
            <IconButton icon='refresh' onClick={() => this.props.dispatch(ftpPreview(path))} />
          </div>
        </header>
        <div className='flex viewport' >
          {this.getPreview()}
        </div>
      </div>
    )
  }
}
