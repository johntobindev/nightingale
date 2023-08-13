import { connect, ConnectedProps } from 'react-redux'
import GetAlbums from './index'
import { getAlbums } from '../../../state/albums/actions'
import { RootState } from '../../../state'

const mapState = (state: RootState) => state.albums
const mapDispatch = { getAlbums }

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(GetAlbums)