import {
  GET_ALBUMS_REQUEST,
  GET_ALBUMS_SUCCESS,
  GET_ALBUMS_FAILURE,
  AlbumsState,
  AlbumsActions,
} from './types'
import { combineReducers } from 'redux'

export const initialState: AlbumsState = {
  loading: false,
  initialised: false,
  numAlbums: 0,
  albums: [],
  options: {
    artistSlug: null,
    sortBy: null,
    search: null,
    decade: null,
    page: null,
  },
  error: null,
}

const loading = (
  state = initialState.loading,
  action: AlbumsActions,
): AlbumsState['loading'] => {
  switch (action.type) {
    case GET_ALBUMS_REQUEST:
      return true

    case GET_ALBUMS_SUCCESS:
    case GET_ALBUMS_FAILURE:
      return false

    default:
      return state
  }
}

const initialised = (
  state = initialState.initialised,
  action: AlbumsActions,
): AlbumsState['initialised'] => {
  switch (action.type) {
    case GET_ALBUMS_SUCCESS:
    case GET_ALBUMS_FAILURE:
      return true

    default:
      return state
  }
}

const numAlbums = (
  state = initialState.numAlbums,
  action: AlbumsActions,
): AlbumsState['numAlbums'] => {
  switch (action.type) {
    case GET_ALBUMS_REQUEST:
      if (action.meta.getPage === true)
        return state

      return initialState.numAlbums

    case GET_ALBUMS_SUCCESS:
      return action.payload.numAlbums

    case GET_ALBUMS_FAILURE:
      return initialState.numAlbums

    default:
      return state
  }
}

const albums = (
  state = initialState.albums,
  action: AlbumsActions,
): AlbumsState['albums'] => {
  switch (action.type) {
    case GET_ALBUMS_REQUEST:
      if (action.meta.getPage === true)
        return state

      return initialState.albums

    case GET_ALBUMS_SUCCESS:
      if (action.meta.getPage === true)
        return [...state, ...action.payload.albums]

      return action.payload.albums

    default:
      return state
  }
}

const options = (
  state = initialState.options,
  action: AlbumsActions,
): AlbumsState['options'] => {
  switch (action.type) {
    case GET_ALBUMS_SUCCESS:
      return action.meta.options

    default:
      return state
  }
}

const error = (
  state = initialState.error,
  action: AlbumsActions,
): AlbumsState['error'] => {
  switch (action.type) {
    case GET_ALBUMS_REQUEST:
      return initialState.error

    case GET_ALBUMS_FAILURE:
      return action.payload.error.message

    default:
      return state
  }
}

export default combineReducers({
  loading,
  initialised,
  numAlbums,
  albums,
  options,
  error,
})