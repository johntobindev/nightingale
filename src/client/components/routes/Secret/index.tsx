import React from 'react'
import { test } from './test'
import Elem from './Elem'

const Secret = () => (
  <div>You are on the secret page! <Elem>{test}</Elem></div>
)

export default Secret