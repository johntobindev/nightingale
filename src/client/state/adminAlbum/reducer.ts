import {
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  ADD_ALBUM_REQUEST,
  ADD_ALBUM_SUCCESS,
  ADD_ALBUM_FAILURE,
  AdminAlbumState,
  AdminAlbumActions,
  SET_VALUE,
  ADD_TRACK,
  DELETE_TRACK,
  EDIT_TRACK,
  ErrorsType,
  MOVE_UP,
  MOVE_DOWN,
  INITIALISE_REQUEST,
  INITIALISE_SUCCESS,
  INITIALISE_FAILURE,
  RESET,
  UPDATE_ALBUM_REQUEST,
  UPDATE_ALBUM_SUCCESS,
  UPDATE_ALBUM_FAILURE,
  DELETE_ALBUM_REQUEST,
  DELETE_ALBUM_SUCCESS,
  DELETE_ALBUM_FAILURE,
} from './types'
import { combineReducers } from 'redux'
import Utils from '../Utils'
import GlobalUtils from '../../../global/Utils'

export const initialState: AdminAlbumState = {
  initialised: false,
  loading: false,
  error: null,
  errors: {
    name: null,
    slug: null,
    year: null,
    tracks: [{
      name: null,
      lengthSeconds: null,
    }],
    image: null,
  },
  uploading: false,
  image: null,
  name: '',
  slug: '',
  year: '',
  artistId: '',
  tracks: [{
    number: '1',
    name: '',
    lengthSeconds: '',
  }],
  artists: null,
  id: null,
  deletedTracks: [],
  isDeleted: false,
}

const initialised = (
  state = initialState.initialised,
  action: AdminAlbumActions,
): AdminAlbumState['initialised'] => {
  switch (action.type) {
    case INITIALISE_SUCCESS:
      return true

    // Falsify on update success so that we know to init album again and avoid
    // missing data, e.g. newly added tracks would be missing ids
    case RESET:
    case UPDATE_ALBUM_SUCCESS:
      return initialState.initialised

    default:
      return state
  }
}

const loading = (
  state = initialState.loading,
  action: AdminAlbumActions,
): AdminAlbumState['loading'] => {
  switch (action.type) {
    case ADD_ALBUM_REQUEST:
    case UPDATE_ALBUM_REQUEST:
    case INITIALISE_REQUEST:
    case DELETE_ALBUM_REQUEST:
      return true

    case ADD_ALBUM_SUCCESS:
    case ADD_ALBUM_FAILURE:
    case UPDATE_ALBUM_SUCCESS:
    case UPDATE_ALBUM_FAILURE:
    case INITIALISE_SUCCESS:
    case INITIALISE_FAILURE:
    case DELETE_ALBUM_SUCCESS:
    case DELETE_ALBUM_FAILURE:
      return false

    default:
      return state
  }
}

const error = (
  state = initialState.error,
  action: AdminAlbumActions,
): AdminAlbumState['error'] => {
  switch (action.type) {
    case ADD_ALBUM_REQUEST:
    case UPDATE_ALBUM_REQUEST:
    case INITIALISE_REQUEST:
    case RESET:
      return initialState.error

    case ADD_ALBUM_FAILURE:
    case UPDATE_ALBUM_FAILURE:
    case INITIALISE_FAILURE:
    case DELETE_ALBUM_FAILURE:
      if (action.payload.error instanceof Error)
        return action.payload.error.message

      return state

    default:
      return state
  }
}

const errors = (
  state = { ...initialState.errors, tracks: [...initialState.errors.tracks] },
  action: AdminAlbumActions,
): AdminAlbumState['errors'] => {
  switch (action.type) {
    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        image: action.payload.error.message,
      }

    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        image: initialState.errors.image,
      }

    case ADD_ALBUM_FAILURE:
    case UPDATE_ALBUM_FAILURE: {
      if (action.payload.error instanceof Error)
        return state

      let tracks: ErrorsType['tracks'][0][]  = []
      for (let i = 0; i < state.tracks.length; i++)
        tracks[i] = { name: null, lengthSeconds: null }

      const clearState = { ...initialState, tracks: [...tracks] }

      return { ...clearState, ...action.payload.error }
    }

    case ADD_ALBUM_REQUEST:
    case UPDATE_ALBUM_REQUEST: {
      let newTracks: AdminAlbumState['errors']['tracks'] = []
      for (let i = 0; i < state.tracks.length; i++)
        newTracks.push({ ...initialState.errors.tracks[0] })
      return { ...initialState.errors, tracks: [...newTracks] }
    }

    case RESET:
      return { ...initialState.errors, tracks: [...initialState.errors.tracks] }

    case ADD_TRACK:
      return {
        ...state,
        tracks: [
          ...state.tracks,
          { ...initialState.errors.tracks[0] },
        ],
      }

    case DELETE_TRACK: {
      if (state.tracks.length === 1) return state
      const { key } = action.meta

      let copy = [...state.tracks]
      copy.splice(key, 1)

      return { ...state, tracks: copy }
    }

    case MOVE_UP: {
      const { key } = action.meta
      if (key === 0) return state

      let tracksCopy = [...state.tracks]
      const trackToMoveUpCopy = {...tracksCopy[key]}
      const trackToMoveDownCopy = {...tracksCopy[key - 1]}

      tracksCopy[key - 1] = trackToMoveUpCopy
      tracksCopy[key] = trackToMoveDownCopy

      return { ...state, tracks: [...tracksCopy] }
    }

    case MOVE_DOWN: {
      const { key } = action.meta
      if (key === (state.tracks.length -1)) return state

      let tracksCopy = [...state.tracks]
      const trackToMoveDownCopy = {...tracksCopy[key]}
      const trackToMoveUpCopy = {...tracksCopy[key + 1]}

      tracksCopy[key + 1] = trackToMoveDownCopy
      tracksCopy[key] = trackToMoveUpCopy

      return { ...state, tracks: [...tracksCopy] }
    }

    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined) {
        let tracks: AdminAlbumState['errors']['tracks'] = []
        for (let i = 0; i < action.payload.album.tracklist.length; i++)
          tracks.push({ ...initialState.errors.tracks[0] })
        return { ...state, tracks }
      }

      return state

    default:
      return state
  }
}

const uploading = (
  state = initialState.uploading,
  action: AdminAlbumActions,
): AdminAlbumState['uploading'] => {
  switch (action.type) {
    case UPLOAD_IMAGE_REQUEST:
      return true

    case UPLOAD_IMAGE_SUCCESS:
    case UPLOAD_IMAGE_FAILURE:
      return false

    default:
      return state
  }
}

const image = (
  state = initialState.image,
  action: AdminAlbumActions,
): AdminAlbumState['image'] => {
  switch (action.type) {
    case UPLOAD_IMAGE_REQUEST:
      return initialState.image

    case UPLOAD_IMAGE_SUCCESS:
      return action.payload.image

    case ADD_ALBUM_SUCCESS:
    case RESET:
      return initialState.image

    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined)
        return action.payload.album.image

      return state

    default:
      return state
  }
}

const name = (
  state = initialState.name,
  action: AdminAlbumActions,
): AdminAlbumState['name'] => {
  if (!Utils.metaNameCheck('name', action, true))
    return state

  switch (action.type) {
    case SET_VALUE:
      return action.payload.value

    case ADD_ALBUM_SUCCESS:
    case RESET:
      return initialState.name

    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined)
        return action.payload.album.name

      return state

    default:
      return state
  }
}

const slug = (
  state = initialState.slug,
  action: AdminAlbumActions,
): AdminAlbumState['slug'] => {
  if (Utils.metaNameCheck('name', action)) {
    if (action.type === SET_VALUE)
      return GlobalUtils.slugify(action.payload.value)
  }

  if (!Utils.metaNameCheck('slug', action, true))
    return state

  switch (action.type) {
    case SET_VALUE:
      return action.payload.value

    case ADD_ALBUM_SUCCESS:
    case RESET:
      return initialState.slug

    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined)
        return action.payload.album.slug

      return state

    default:
      return state
  }
}

const year = (
  state = initialState.year,
  action: AdminAlbumActions,
): AdminAlbumState['year'] => {
  if (!Utils.metaNameCheck('year', action, true))
    return state

  switch (action.type) {
    case SET_VALUE:
      return action.payload.value

    case ADD_ALBUM_SUCCESS:
    case RESET:
      return initialState.year

    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined)
        return action.payload.album.year

      return state

    default:
      return state
  }
}

const artistId = (
  state = initialState.artistId,
  action: AdminAlbumActions,
): AdminAlbumState['artistId'] => {
  if (!Utils.metaNameCheck('artistId', action, true))
    return state

  switch (action.type) {
    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined)
        return action.payload.album.artist.id

      // If artist prev selected, set again if exists
      if (state.length > 0)
        for (let artist of action.payload.artists)
          if (artist.id === state)
            return state

      // Set first artist in array as selected
      return action.payload.artists[0].id

    case SET_VALUE:
      return action.payload.value

    default:
      return state
  }
}

const tracks = (
  state = [{...initialState.tracks[0]}],
  action: AdminAlbumActions,
): AdminAlbumState['tracks'] => {
  switch (action.type) {
    case ADD_TRACK:
      return [...state, {
        number: String(Number(state.length) + 1),
        name: '',
        lengthSeconds: '',
      }]

    case DELETE_TRACK: {
      if (state.length === 1) return state
      const { key } = action.meta

      let copy = [...state]
      copy.splice(key, 1)

      for (let i = 0; i < copy.length; i ++)
        copy[i].number = String(i + 1)

      return copy
    }

    case EDIT_TRACK: {
      let copy = [...state]
      copy[action.meta.key] = {...state[action.meta.key]}
      copy[action.meta.key][action.meta.name] = action.payload.value
      return copy
    }

    case ADD_ALBUM_SUCCESS:
    case RESET:
      return [{...initialState.tracks[0]}]

    case MOVE_UP: {
      const { key } = action.meta
      if (key === 0) return state

      let copy = [...state]
      let trackToMoveUpCopy = {...copy[key]}
      let trackToMoveDownCopy = {...copy[key - 1]}

      trackToMoveUpCopy.number = String(Number(trackToMoveUpCopy.number) - 1)
      trackToMoveDownCopy.number = String(Number(trackToMoveDownCopy.number) + 1)

      copy[key - 1] = trackToMoveUpCopy
      copy[key] = trackToMoveDownCopy

      return copy
    }

    case MOVE_DOWN: {
      const { key } = action.meta
      if (key === (state.length - 1)) return state

      let copy = [...state]
      let trackToMoveDownCopy = {...copy[key]}
      let trackToMoveUpCopy = {...copy[key + 1]}

      trackToMoveDownCopy.number = String(Number(trackToMoveDownCopy.number) + 1)
      trackToMoveUpCopy.number = String(Number(trackToMoveUpCopy.number) - 1)

      copy[key + 1] = trackToMoveDownCopy
      copy[key] = trackToMoveUpCopy

      return copy
    }

    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined)
        return action.payload.album.tracklist

      return state

    default:
      return state
  }
}

const artists = (
  state = initialState.artists,
  action: AdminAlbumActions,
): AdminAlbumState['artists'] => {
  switch (action.type) {
    case INITIALISE_REQUEST:
    case RESET:
      return initialState.artists

    case INITIALISE_SUCCESS:
      return action.payload.artists

    default:
      return state
  }
}

const id = (
  state = initialState.id,
  action: AdminAlbumActions,
): AdminAlbumState['id'] => {
  switch (action.type) {
    case INITIALISE_SUCCESS:
      if (action.payload.album !== undefined)
        return action.payload.album.id

      return state

    case RESET:
      return initialState.id

    default:
      return state
  }
}

const deletedTracks = (
  state = initialState.deletedTracks,
  action: AdminAlbumActions,
): AdminAlbumState['deletedTracks'] => {
  switch (action.type) {
    case DELETE_TRACK:
      if (action.meta.id !== null)
        return [...state, action.meta.id]

      return state

    case UPDATE_ALBUM_SUCCESS:
    case RESET:
      return initialState.deletedTracks

    default:
      return state
  }
}

const isDeleted = (
  state = initialState.isDeleted,
  action: AdminAlbumActions,
): AdminAlbumState['isDeleted'] => {
  switch (action.type) {
    case DELETE_ALBUM_SUCCESS:
      return true

    case RESET:
      return initialState.isDeleted

    default:
      return state
  }
}

export default combineReducers({
  initialised,
  loading,
  error,
  errors,
  uploading,
  image,
  name,
  slug,
  year,
  artistId,
  tracks,
  artists,
  id,
  deletedTracks,
  isDeleted,
})