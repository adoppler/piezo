import React from 'react'

export function RootComponent(props) {
  return (
    <div id="root">
      {props.children}
    </div>
  )
}
