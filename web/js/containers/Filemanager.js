import React from 'react'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'

export default class Filemanager extends React.Component {
  render () {
    return (
      <div className='flex flex-container flex-vertical'>
        <Header dispatch={this.props.dispatch} />
        <Breadcrumbs path={this.props.path} />
      </div>
    )
  }
}
