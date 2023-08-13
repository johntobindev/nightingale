import {
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  ADD_ARTIST_REQUEST,
  ADD_ARTIST_SUCCESS,
  ADD_ARTIST_FAILURE,
  AdminArtistState,
  AdminArtistActions,
  SET_VALUE,
  RESET,
  INITIALISE_REQUEST,
  INITIALISE_SUCCESS,
  INITIALISE_FAILURE,
  UPDATE_ARTIST_REQUEST,
  UPDATE_ARTIST_FAILURE,
  UPDATE_ARTIST_SUCCESS,
  DELETE_ARTIST_REQUEST,
  DELETE_ARTIST_SUCCESS,
  DELETE_ARTIST_FAILURE,
} from './types'
import { combineReducers } from 'redux'
import Utils from '../Utils'
import GlobalUtils from '../../../global/Utils'

export const initialState: AdminArtistState = {
  initialised: false,
  loading: false,
  error: null,
  errors: {
    name: null,
    slug: null,
    image: null,
  },
  uploading: false,
  image: null,
  name: '',
  slug: '',
  id: null,
  isDeleted: false,
}

const initialised = (
  state = initialState.initialised,
  action: AdminArtistActions,
): AdminArtistState['initialised'] => {
  switch (action.type) {
    case INITIALISE_SUCCESS:
      return true

    // Falsify on update success so that we know to init album again and avoid
    // missing data, e.g. newly added tracks would be missing ids
    case RESET:
    case UPDATE_ARTIST_SUCCESS:
      return initialState.initialised

    default:
      return state
  }
}

const loading = (
  state = initialState.loading,
  action: AdminArtistActions,
): AdminArtistState['loading'] => {
  switch (action.type) {
    case ADD_ARTIST_REQUEST:
    case UPDATE_ARTIST_REQUEST:
    case INITIALISE_REQUEST:
    case DELETE_ARTIST_REQUEST:
      return true

    case ADD_ARTIST_SUCCESS:
    case ADD_ARTIST_FAILURE:
    case UPDATE_ARTIST_SUCCESS:
    case UPDATE_ARTIST_FAILURE:
    case INITIALISE_SUCCESS:
    case INITIALISE_FAILURE:
    case DELETE_ARTIST_SUCCESS:
    case DELETE_ARTIST_FAILURE:
      return false

    default:
      return state
  }
}

const error = (
  state = initialState.error,
  action: AdminArtistActions,
): AdminArtistState['error'] => {
  switch (action.type) {
    case ADD_ARTIST_REQUEST:
    case UPDATE_ARTIST_REQUEST:
    case INITIALISE_REQUEST:
    case RESET:
      return initialState.error

    case ADD_ARTIST_FAILURE:
    case UPDATE_ARTIST_FAILURE:
    case INITIALISE_FAILURE:
    case DELETE_ARTIST_FAILURE:
      if (action.payload.error instanceof Error)
        return action.payload.error.message

      return state

    default:
      return state
  }
}

const errors = (
  state = {...initialState.errors},
  action: AdminArtistActions,
): AdminArtistState['errors'] => {
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

    case ADD_ARTIST_FAILURE:
    case UPDATE_ARTIST_FAILURE: {
      if (action.payload.error instanceof Error)
        return state

      return { ...initialState, ...action.payload.error }
    }

    case ADD_ARTIST_REQUEST:
    case UPDATE_ARTIST_REQUEST:
    case RESET:
      return {...initialState.errors}

    default:
      return state
  }
}

const uploading = (
  state = initialState.uploading,
  action: AdminArtistActions,
): AdminArtistState['uploading'] => {
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
  action: AdminArtistActions,
): AdminArtistState['image'] => {
  switch (action.type) {
    case UPLOAD_IMAGE_REQUEST:
      return initialState.image

    case UPLOAD_IMAGE_SUCCESS:
      return action.payload.image

    case INITIALISE_SUCCESS:
      return action.payload.artist.image

    case ADD_ARTIST_SUCCESS:
    case RESET:
      return initialState.image

    default:
      return state
  }
}

const name = (
  state = initialState.name,
  action: AdminArtistActions,
): AdminArtistState['name'] => {
  if (!Utils.metaNameCheck('name', action, true))
    return state

  switch (action.type) {
    case SET_VALUE:
      return action.payload.value

    case INITIALISE_SUCCESS:
      return action.payload.artist.name

    case ADD_ARTIST_SUCCESS:
    case RESET:
      return initialState.name

    default:
      return state
  }
}

const slug = (
  state = initialState.slug,
  action: AdminArtistActions,
): AdminArtistState['slug'] => {
  if (Utils.metaNameCheck('name', action)) {
    if (action.type === SET_VALUE)
      return GlobalUtils.slugify(action.payload.value)
  }

  if (!Utils.metaNameCheck('slug', action, true))
    return state

  switch (action.type) {
    case SET_VALUE:
      return action.payload.value

    case INITIALISE_SUCCESS:
      return action.payload.artist.slug

    case ADD_ARTIST_SUCCESS:
    case RESET:
      return initialState.slug

    default:
      return state
  }
}

const id = (
  state = initialState.id,
  action: AdminArtistActions,
): AdminArtistState['id'] => {
  switch (action.type) {
    case INITIALISE_SUCCESS:
      return action.payload.artist.id

    case RESET:
      return initialState.id

    default:
      return state
  }
}

const isDeleted = (
  state = initialState.isDeleted,
  action: AdminArtistActions,
): AdminArtistState['isDeleted'] => {
  switch (action.type) {
    case DELETE_ARTIST_SUCCESS:
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
  id,
  isDeleted,
})