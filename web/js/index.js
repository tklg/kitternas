import React from 'react'
import ReactDOM from 'react-dom'
import DispatchComponent from './DispatchComponent'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { initAjax, load } from './actions'
import Progress from './components/Progress'
import FtpClient from './containers/FtpClient'
import UserModal from './containers/UserModal'
import '../scss/app.scss'

class App extends DispatchComponent {
  constructor () {
    super()
    this.state = {
      working: [],
      error: null,
      user: null,
      userModal: false,
      token: null,
      directories: {
        '/': []
      }
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
          <UserModal active={this.state.userModal} user={this.state.user} dispatch={this.dispatch} />
          <Switch>
            {/*<Route exact path='/' render={() => <Redirect to='/browse' />} />*/}
            <Route exact path='*' 
              render={({match}) => {
                return <FtpClient
                  path={match.url.substr(1).split('/').filter(x => x.length > 0)} 
                  dispatch={this.dispatch}
                  user={this.state.user}
                  token={this.state.token}
                  directories={this.state.directories} />
              }} />
            </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
