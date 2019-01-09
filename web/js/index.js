import React from 'react'
import ReactDOM from 'react-dom'
import DispatchComponent from './DispatchComponent'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Progress from './components/Progress'
import Filemanager from './containers/Filemanager'
import UserModal from './containers/UserModal'
import '../scss/app.scss'

class App extends DispatchComponent {
  constructor () {
    super()
    this.state = {
      working: [],
      error: null,
      user: null,
      userModal: false
    }
  }
  render () {
    return (
      <Router>
        <div className='root-container flex-container'>
          <Progress working={this.state.working.length} />
          <UserModal active={this.state.userModal} user={this.state.user} />
          <Route exact path='*' 
            render={({match}) => {
              return <Filemanager path={match.url.substr(1).split('/')} dispatch={this.dispatch} />
            }} />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
