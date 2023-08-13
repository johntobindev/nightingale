import { connect, ConnectedProps } from 'react-redux'
import Album from './index'
import { 
  initialise, 
  reset,
  setValue, 
  addTrack, 
  deleteTrack, 
  editTrack, 
  addAlbum, 
  updateAlbum, 
  uploadImage, 
  moveUp, 
  moveDown, 
  deleteAlbum,
} from '../../../../state/adminAlbum/actions'
import { RootState } from '../../../../state'

const mapState = (state: RootState) => state.adminAlbum
const mapDispatch = { 
  initialise, 
  reset, 
  setValue, 
  addTrack, 
  deleteTrack, 
  editTrack, 
  addAlbum, 
  updateAlbum, 
  uploadImage, 
  moveUp, 
  moveDown, 
  deleteAlbum,
}

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Album)