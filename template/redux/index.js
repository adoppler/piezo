import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(state => state)

export { Provider as RootComponent }
export const rootProps = {
  store
}
