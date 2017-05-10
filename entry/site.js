import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from 'pages'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('react')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('pages', () => { render(App) })
}
