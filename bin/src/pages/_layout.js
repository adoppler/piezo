import React, { Component, Children } from 'react'
import { Link } from 'react-router'

export default class Layout extends Component {

  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/help">Help</Link>
        </nav>
        {this.props.children}
      </div>
    )
  }
}
