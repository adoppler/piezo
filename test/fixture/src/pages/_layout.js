import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'

import './layout.css'

export default class Layout extends Component {

  render() {
    return (
      <div id="container" styleName="container">
        <Helmet titleTemplate="%s - Test Site">
          <meta charSet="utf-8" />
        </Helmet>
        <nav id="nav" styleName="navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <main id="main" styleName="main">
          {this.props.children}
        </main>
      </div>
    )
  }

}
