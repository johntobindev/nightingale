import { connect, ConnectedProps } from 'react-redux'
import Menu from './index'
import { hideMenuOverlay } from '../../../state/overlays/actions'
import { withRouter } from 'react-router-dom'
import { RootState } from '../../../state'

const mapState = (state: RootState) => state.overlays.menuOverlay
const mapDispatch = { hideOverlay: hideMenuOverlay }

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(withRouter(Menu))