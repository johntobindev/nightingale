import React from 'react'
import MenuOverlay from './Menu/Connected'
import { PropsFromRedux } from './Connected'

const Overlays = (props: PropsFromRedux) => (
  <div>
    {props.overlays.menuOverlay.active && <MenuOverlay/>}
  </div>
)

export default Overlays