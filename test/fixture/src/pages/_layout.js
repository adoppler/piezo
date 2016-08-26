import React, { Component } from 'react'
import { Link } from 'react-router'

import css from './layout.css'

export default class Layout extends Component {

  render() {
    return (
      <div id="container" className={css.container}>
        <nav id="nav" className={css.navigation}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <main id="main" className={css.main}>
          {this.props.children}
        </main>
      </div>
    )
  }

}
