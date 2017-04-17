import React, { Component } from 'react'
import Helmet from 'react-helmet'

export default class About extends Component {

  render() {
    return (
      <div>
        <Helmet>
          <title>About Page Title</title>
        </Helmet>
        <h1>About</h1>
      </div>
    )
  }

}
