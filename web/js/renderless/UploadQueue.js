import React from 'react'
import { upload } from '../actions'

export default class UploadQueue extends React.Component {
  constructor () {
    super()
    this.state = {
      running: 0,
      started: []
    }
    this.start = this.start.bind(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.queue.length > prevProps.queue.length && this.state.running < this.props.concurrent) {
      this.start()
    } else if (this.props.queue.length < prevProps.queue.length && this.state.running) {
      this.setState({
        running: this.state.running - 1
      }, () => {
        if (this.props.queue.length) {
          this.start()
        } else {
          this.setState({
            started: []
          })
        }
      })
    }
  }
  start () {
    let first
    for (let i = 0; i < this.props.queue.length; i++) {
      if (this.state.started.indexOf(this.props.queue[i].uuid) === -1) {
        first = this.props.queue[i]
        this.setState({
          started: [...this.state.started, first.uuid]
        }, () => {
          if (this.props.concurrent > 1 && this.props.queue.length >= this.props.concurrent && this.state.running < this.props.concurrent) {
            this.start()
          }
        })
        break
      }
    }
    if (!first) return
    this.setState({
      running: this.state.running + 1
    }, () => {
      this.props.dispatch(upload(first))
    })
  }
  render () { return null }
}
