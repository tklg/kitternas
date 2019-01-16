import React from 'react'
import { Link } from 'react-router-dom'
import { List, AutoSizer } from 'react-virtualized'
import DirectoryFile, { createContextMenu } from './DirectoryFile'
import IconButton from './IconButton'
import { setStateValue, ftpList, ftpCreate, ftpMkdir, addToUploadQueue } from '../actions'
import Util from '../lib/Util'
function renderFile (params, path, files, dispatch) {
  return <DirectoryFile {...params} path={path} files={files} key={params.key} dispatch={dispatch} />
}

export default ({ path, files, pos, ...props }) => {
  path = Util.cleanPath(path)
  return (
    <div className={'directory flex flex-container flex-vertical' + (` position-${pos}`)}>
      <header className='flex-container'>
        <Link
          to={decodeURIComponent(path)}
          className='flex'>
          <span>{path === '/' ? 'My files' : path.split('/').reverse()[0]}</span>
          <span className='count'>{files.length + ' items'}</span>
        </Link>
        {pos > 0 && <div className='buttons flex-none'>
          <IconButton icon='file-upload' onClick={() => {
            const el = document.createElement('input')
            el.type = 'file'
            el.name = 'files[]'
            el.setAttribute('multiple', '')
            el.addEventListener('change', function (e) {
              props.dispatch(addToUploadQueue(e, path))
              setTimeout(() => el.remove(), 1000)
            })
            el.click()
          }} />
          {/*<IconButton icon='folder-upload' onClick={() => props.dispatch()} />*/}
          {/*<IconButton icon='file-plus' onClick={() => props.dispatch(setStateValue('confirmationModal', {
            header: `Create new file`,
            submitLabel: 'Create',
            value: '',
            onSubmit (e, name) {
              props.dispatch(ftpCreate(path, name))
            }
          }))} />*/}
          <IconButton icon='folder-plus' onClick={() => props.dispatch(setStateValue('confirmationModal', {
            header: `Create new directory`,
            submitLabel: 'Create',
            value: '',
            onSubmit (e, name) {
              props.dispatch(ftpMkdir(path, name))
            }
          }))} />
          <IconButton icon='refresh' onClick={() => props.dispatch(ftpList(path))} />
        </div>}
        {pos === 0 && <div className='buttons flex-none'>
          <IconButton icon='dots-vertical' onClick={(e) => createContextMenu(path, { type: 'd', name: path.split('/').reverse()[0], fake: true }, e, props.dispatch)} />
        </div>}
      </header>
      <div className='flex' onContextMenu={(e) => createContextMenu(path, { type: 'd', name: path.split('/').reverse()[0], fake: true }, e, props.dispatch)} >
        <AutoSizer>
          {({ width, height }) => (
            <List
              className='files'
              width={width}
              height={height}
              rowCount={files.length}
              rowHeight={42}
              rowRenderer={params => renderFile(params, path, files, props.dispatch)} />
          )}
        </AutoSizer>
      </div>
    </div>
  )
}
