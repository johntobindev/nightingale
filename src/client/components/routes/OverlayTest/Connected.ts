import { connect, ConnectedProps } from 'react-redux'
import OverlayTest from './index'
import { showMenuOverlay } from '../../../state/overlays/actions'

const mapDispatch = { showOverlay: showMenuOverlay }

const connector = connect(null, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(OverlayTest)