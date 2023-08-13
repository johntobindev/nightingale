import { connect, ConnectedProps } from 'react-redux'
import Header from './index'
import { RootState } from '../../../state'

const mapState = (state: RootState) => ({
  artistError: state.artist.error,
})
const mapDispatch = {}

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Header)