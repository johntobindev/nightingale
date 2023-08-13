import { connect, ConnectedProps } from 'react-redux'
import UploadImage from './index'
import { uploadImage } from '../../../../state/adminAlbum/actions'
import { RootState } from '../../../../state'

const mapState = (state: RootState) => state.adminAlbum
const mapDispatch = { uploadImage }

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(UploadImage)