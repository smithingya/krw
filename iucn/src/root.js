import App from './App'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router'

const Root = ({ store }) => (
  <Provider store={store}>
    <MemoryRouter>
      <Route path='/:filter?' component={App} />
    </MemoryRouter>
  </Provider>
)

export default Root
