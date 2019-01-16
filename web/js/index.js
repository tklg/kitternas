import React from 'react'
import ReactDOM from 'react-dom'
import DispatchComponent from './DispatchComponent'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { initAjax, load } from './actions'
import Progress from './components/Progress'
import FtpClient from './containers/FtpClient'
import UserModal from './containers/UserModal'
import ConfirmationModal from './containers/ConfirmationModal'
import ContextMenu from './containers/ContextMenu'
import UploadQueue from './renderless/UploadQueue'
import ErrorContainer from './components/ErrorContainer'
import '../scss/app.scss'

class App extends DispatchComponent {
  constructor () {
    super()
    this.state = {
      working: [],
      error: null,
      user: null,
      userModal: false,
      confirmationModal: null,
      contextMenu: null,
      token: null,
      directories: { '/': [] },
      previews: {},
      uploadQueue: []
    }
  }
  componentDidMount () {
    this.dispatch(initAjax())
    this.dispatch(load())
  }
  render () {
    return (
      <Router basename='/browse'>
        <div className='root-container flex-container'>
          <Progress working={this.state.working.length} />
          <ErrorContainer error={this.state.error} dispatch={this.dispatch} />
          <UserModal active={this.state.userModal} user={this.state.user} dispatch={this.dispatch} />
          <ConfirmationModal content={this.state.confirmationModal} dispatch={this.dispatch} />
          <ContextMenu {...this.state.contextMenu} dispatch={this.dispatch} />
          <UploadQueue queue={this.state.uploadQueue} concurrent={2} dispatch={this.dispatch} />
          <Switch>
            {/*<Route exact path='/' render={() => <Redirect to='/browse' />} />*/}
            <Route exact path='*' 
              render={({match}) => {
                return <FtpClient
                  path={match.url.substr(1).split('/').filter(x => x.length > 0).map(x => decodeURIComponent(x))} 
                  dispatch={this.dispatch}
                  user={this.state.user}
                  token={this.state.token}
                  directories={this.state.directories}
                  previews={this.state.previews} />
              }} />
            </Switch>
        </div>
      </Router>
    )
  }
}

if (window.location.pathname === '/') window.location.href = '/browse'
ReactDOM.render(<App />, document.getElementById('root'))
