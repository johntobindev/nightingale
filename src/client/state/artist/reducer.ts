import {
  GET_ARTIST_REQUEST,
  GET_ARTIST_SUCCESS,
  GET_ARTIST_FAILURE,
  ArtistState,
  ArtistActions,
} from './types'
import { combineReducers } from 'redux'

export const initialState: ArtistState = {
  loading: false,
  artist: null,
  slug: null,
  error: null,
}

const loading = (
  state = initialState.loading,
  action: ArtistActions,
): ArtistState['loading'] => {
  switch (action.type) {
    case GET_ARTIST_REQUEST:
      return true

    case GET_ARTIST_SUCCESS:
    case GET_ARTIST_FAILURE:
      return false

    default:
      return state
  }
}

const artist = (
  state = initialState.artist,
  action: ArtistActions,
): ArtistState['artist'] => {
  switch (action.type) {
    case GET_ARTIST_REQUEST:
      return initialState.artist

    case GET_ARTIST_SUCCESS:
      return action.payload.artist

    default:
      return state
  }
}

const slug = (
  state = initialState.slug,
  action: ArtistActions,
): ArtistState['slug'] => {
  switch (action.type) {
    case GET_ARTIST_SUCCESS:
      return action.meta.slug

    default:
      return state
  }
}

const error = (
  state = initialState.error,
  action: ArtistActions,
): ArtistState['error'] => {
  switch (action.type) {
    case GET_ARTIST_REQUEST:
      return initialState.error

    case GET_ARTIST_FAILURE:
      return action.payload.error.message

    default:
      return state
  }
}

export default combineReducers({
  loading,
  artist,
  slug,
  error,
})