import React from 'react'
import { NavLink } from 'react-router-dom'
import { List, AutoSizer } from 'react-virtualized'
import { setStateValue, ftpList, ftpRename, ftpCreate, ftpMkdir, ftpDelete, ftpDownload, addToUploadQueue } from '../actions'
import Icon from './Icon'
import Util from '../lib/Util'
import moment from 'moment'
import { getType } from '../lib/Filetypes'

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
  if (!size) return '0 B'
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}

const menuItem = (icon, str) => <div className='flex-container'><Icon icon={icon} /><span className='flex'>{str}</span></div>

const contextMenuItems = (path, name, dispatch) => ({
  'spacer': { spacer: true },
  'rename': {
    react: menuItem('square-edit-outline', 'Rename'),
    onClick (e) {
      dispatch(setStateValue('confirmationModal', {
        header: `Rename ${name}`,
        submitLabel: 'Rename',
        value: name,
        onSubmit (e, value) {
          const prevPath = Util.parentPath(path)
          console.log('edit ' + prevPath + ' to ' + value)
          dispatch(ftpRename(prevPath, name, value))
        }
      }))
    }
  },
  'delete': {
    react: menuItem('delete', 'Delete'),
    onClick (e) {
      dispatch(setStateValue('confirmationModal', {
        header: `Delete ${name}?`,
        submitLabel: 'Delete',
        onSubmit () {
          console.log('delete: ' + path)
          dispatch(ftpDelete(path))
        }
      }))
    }
  },
  'download': {
    react: menuItem('download', 'Download'),
    onClick (e) {
      console.log('download ' + path)
      dispatch(ftpDownload(path))
    }
  },
  'file-upload': {
    react: menuItem('file-upload', 'Upload file'),
    onClick (e) {
      console.log('file-upload ' + path)
      const el = document.createElement('input')
      el.type = 'file'
      el.name = 'files[]'
      el.setAttribute('multiple', '')
      el.addEventListener('change', function (e) {
        dispatch(addToUploadQueue(e, path))
        setTimeout(() => el.remove(), 1000)
      })
      el.click()
    }
  },
  'folder-upload': {
    react: menuItem('folder-upload', 'Upload folder'),
    onClick (e) {
      console.log('folder-upload ' + path)
    }
  },
  'file-plus': {
    react: menuItem('file-plus', 'New file'),
    onClick (e) {
      dispatch(setStateValue('confirmationModal', {
        header: `Create new file`,
        submitLabel: 'Create',
        value: '',
        onSubmit (e, name) {
          console.log('create ' + path + ': ' + name)
          dispatch(ftpCreate(path, name))
        }
      }))
    }
  },
  'folder-plus': {
    react: menuItem('folder-plus', 'New folder'),
    onClick (e) {
      dispatch(setStateValue('confirmationModal', {
        header: `Create new directory`,
        submitLabel: 'Create',
        value: '',
        onSubmit (e, name) {
          const prevPath = Util.parentPath(path)
          dispatch(ftpMkdir(prevPath, name))
        }
      }))
    }
  },
  'move': {
    react: menuItem('folder-move', 'Move'),
    onClick (e) {
      console.log('folder-move ' + path)
    }
  },
  'refresh': {
    react: menuItem('refresh', 'Refresh'),
    onClick (e) {
      const prevPath = Util.parentPath(path)
      dispatch(ftpList(prevPath))
    }
  }
})

function createContextMenu (path, file, e, dispatch) {
  if (e.shiftKey === true) return
  e.stopPropagation()
  e.preventDefault()
  path = Util.cleanPath(path)
  const allMenuItems = contextMenuItems(path === '/' ? file.name : Util.cleanPath(`/${path}/${file.name}`), file.name, dispatch)
  let items
  if (file.type === 'd') 
    if (path === '/' && file.fake) items = [/*'download', */'file-upload', /*'folder-upload', 'file-plus',*/ 'folder-plus', 'spacer', 'refresh']
    else items = ['rename', 'delete', /*'download',*/ 'file-upload', /*'folder-upload', 'file-plus',*/ 'folder-plus', 'spacer', 'move', 'refresh']
  else items = ['rename', 'delete', 'download', 'spacer', 'move']

  dispatch(setStateValue('contextMenu', {
    x: e.clientX - 25,
    y: e.clientY - 25,
    items: items.map(k => allMenuItems[k])
  }))
}

export default ({ index, isScrolling, isVisible, style, parent, path, files, ...props }) => {
  const file = files[index]
  path = Util.cleanPath(path)
  return (
    <NavLink
      to={path === '/' ? `/${file.name}` : Util.cleanPath(`/${path}/${encodeURIComponent(file.name)}`)}
      className={'file' + (file.type === 'd' ? ' folder' : '')}
      style={style}
      onContextMenu={(e) => createContextMenu(path, file, e, props.dispatch)}>
      <div className='stack stack-horizontal flex-container'>
        <span className='name flex'>{file.name}</span>
        <span className='date'>{moment(file.date).format('ddd, MMM D [at] h:mm a')}</span>
      </div>
      <div className='stack stack-horizontal flex-container'>
        <span className='permissions flex'>{file.type + rights2str(file.rights)}</span>
        <span className='size'>{/*getType(file) + ' - ' + */(file.type === 'd' ? '' : `${fileSize(file.size)}`)}</span>
      </div>
    </NavLink>
  )
}

export {
  createContextMenu
}
