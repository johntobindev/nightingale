import { connect, ConnectedProps } from 'react-redux'
import Artist from './index'
import {
  initialise,
  setValue,
  addArtist,
  updateArtist,
  uploadImage,
  reset,
  deleteArtist,
} from '../../../../state/adminArtist/actions'
import { RootState } from '../../../../state'

const mapState = (state: RootState) => state.adminArtist
const mapDispatch = { 
  initialise,
  setValue,
  addArtist,
  updateArtist,
  uploadImage,
  reset,
  deleteArtist,
}

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Artist)