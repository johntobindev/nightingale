import { connect, ConnectedProps } from 'react-redux'
import Header from './index'
import { getArtist } from '../../../../state/artist/actions'
import { RootState } from '../../../../state'

const mapState = (state: RootState) => ({
  artistState: state.artist,
  albumState: state.album,
})
const mapDispatch = { getArtist }

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Header)