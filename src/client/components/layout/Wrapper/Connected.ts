import { connect, ConnectedProps } from 'react-redux'
import Wrapper from './index'
import { lockWrapper, unlockWrapper } from '../../../state/wrapper/actions'
import { RootState } from '../../../state'

const mapState = (state: RootState) => state.wrapper
const mapDispatch = { lockWrapper, unlockWrapper }

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Wrapper)