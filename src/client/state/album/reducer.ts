import {
  GET_ALBUM_REQUEST,
  GET_ALBUM_SUCCESS,
  GET_ALBUM_FAILURE,
  AlbumState,
  AlbumActions,
} from './types'
import { combineReducers } from 'redux'

export const initialState: AlbumState = {
  loading: false,
  album: null,
  slug: null,
  error: null,
}

const loading = (
  state = initialState.loading,
  action: AlbumActions,
): AlbumState['loading'] => {
  switch (action.type) {
    case GET_ALBUM_REQUEST:
      return true

    case GET_ALBUM_SUCCESS:
    case GET_ALBUM_FAILURE:
      return false

    default:
      return state
  }
}

const album = (
  state = initialState.album,
  action: AlbumActions,
): AlbumState['album'] => {
  switch (action.type) {
    case GET_ALBUM_REQUEST:
      return initialState.album

    case GET_ALBUM_SUCCESS:
      return action.payload.album

    default:
      return state
  }
}

const slug = (
  state = initialState.slug,
  action: AlbumActions,
): AlbumState['slug'] => {
  switch (action.type) {
    case GET_ALBUM_SUCCESS:
      return action.meta.slug

    default:
      return state
  }
}

const error = (
  state = initialState.error,
  action: AlbumActions,
): AlbumState['error'] => {
  switch (action.type) {
    case GET_ALBUM_REQUEST:
      return initialState.error

    case GET_ALBUM_FAILURE:
      return action.payload.error.message

    default:
      return state
  }
}

export default combineReducers({
  loading,
  album,
  slug,
  error,
})