import { connect, ConnectedProps } from 'react-redux'
import Overlays from './index'
import { RootState } from '../../state'

const mapState = (state: RootState) => ({ overlays: state.overlays })

const connector = connect(mapState)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Overlays)