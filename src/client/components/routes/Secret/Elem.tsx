import React from 'react'

interface Props {
  children: React.ReactNode,
}

const Elem = (props: Props) => (
  <button style={{
    padding: '0.5em 0.75em',
    backgroundColor: '#eee',
  }}>{props.children}</button>
)

export default Elem