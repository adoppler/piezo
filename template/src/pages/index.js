import React, { Component } from 'react'
import Helmet from 'react-helmet'

export default class Home extends Component {

  render() {
    return (
      <div>
        <Helmet>
          <title>Home Page Title</title>
        </Helmet>
        <h1>Home</h1>
      </div>
    )
  }

}
