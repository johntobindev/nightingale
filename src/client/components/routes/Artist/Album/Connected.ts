import { connect, ConnectedProps } from 'react-redux'
import Album from './index'
import { getAlbum } from '../../../../state/album/actions'
import { RootState } from '../../../../state'

const mapState = (state: RootState) => state.album
const mapDispatch = { getAlbum }

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Album)