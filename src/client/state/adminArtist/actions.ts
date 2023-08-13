import { 
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  ADD_ARTIST_REQUEST,
  ADD_ARTIST_SUCCESS,
  ADD_ARTIST_FAILURE,
  UPDATE_ARTIST_REQUEST,
  UPDATE_ARTIST_SUCCESS,
  UPDATE_ARTIST_FAILURE,
  AdminArtistActions,
  SET_VALUE,
  AdminArtistState,
  INITIALISE_REQUEST,
  INITIALISE_SUCCESS,
  INITIALISE_FAILURE,
  RESET,
  DELETE_ARTIST_REQUEST,
  DELETE_ARTIST_SUCCESS,
  DELETE_ARTIST_FAILURE,
} from './types'
import { addNotification } from '../notifications/actions'
import { AppThunk } from '../types'
import Utils from '../Utils'
import Validator from '../../../api/Artists/Validator'
import AlbumsValidator from '../../../api/Albums/Validator'
import { ArtistType } from '../artist/types'

const uploadImageRequest = (): AdminArtistActions => ({
  type: UPLOAD_IMAGE_REQUEST,
})

const uploadImageSuccess = (
  image: string,
): AdminArtistActions => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: { image },
})

const uploadImageFailure = (
  error: Error,
): AdminArtistActions => ({
  type: UPLOAD_IMAGE_FAILURE,
  payload: { error },
})

const addArtistRequest = (): AdminArtistActions => ({ 
  type: ADD_ARTIST_REQUEST,
})

const addArtistSuccess = (): AdminArtistActions => ({
  type: ADD_ARTIST_SUCCESS,
})

const addArtistFailure = (
  error: Error | AdminArtistState['errors'],
): AdminArtistActions => ({
  type: ADD_ARTIST_FAILURE,
  payload: { error },
})

const updateArtistRequest = (): AdminArtistActions => ({ 
  type: UPDATE_ARTIST_REQUEST,
})

const updateArtistSuccess = (): AdminArtistActions => ({
  type: UPDATE_ARTIST_SUCCESS,
})

const updateArtistFailure = (
  error: Error | AdminArtistState['errors'],
): AdminArtistActions => ({
  type: UPDATE_ARTIST_FAILURE,
  payload: { error },
})

const initialiseRequest = (): AdminArtistActions => ({
  type: INITIALISE_REQUEST,
})

const initialiseSuccess = (
  artist: ArtistType,
): AdminArtistActions => ({
  type: INITIALISE_SUCCESS,
  payload: { artist },
})

const initialiseFailure = (
  error: Error,
): AdminArtistActions => ({
  type: INITIALISE_FAILURE,
  payload: { error },
})

export const setValue = (
  name: string,
  value: string,
): AdminArtistActions => ({
  type: SET_VALUE,
  payload: { value },
  meta: { name },
})

export const reset = (): AdminArtistActions => ({ 
  type: RESET,
})

const deleteArtistRequest = (): AdminArtistActions => ({ 
  type: DELETE_ARTIST_REQUEST,
})

const deleteArtistSuccess = (): AdminArtistActions => ({
  type: DELETE_ARTIST_SUCCESS,
})

const deleteArtistFailure = (
  error: Error,
): AdminArtistActions => ({
  type: DELETE_ARTIST_FAILURE,
  payload: { error },
})

export const uploadImage = (file: File): AppThunk => async dispatch => {
  dispatch(uploadImageRequest())

  try {
    AlbumsValidator.validateImageClientSide(file)
    let fd = new FormData()
    fd.append('file', file)  
    const uploadedName = await Utils.request('/admin/uploadImage', fd, true)
    dispatch(uploadImageSuccess(uploadedName))
  } catch (error) {
    dispatch(uploadImageFailure(error))
  }
}

export const addArtist = (): AppThunk => async (dispatch, getState) => {
  dispatch(addArtistRequest())

  const { name, slug, image } = getState().adminArtist
  const artist = { name, slug, image }

  try {
    Validator.validateArtist(artist)
    await Utils.request('/admin/addArtist', { artist })
    dispatch(addNotification('Artist added!'))
    dispatch(addArtistSuccess())
  } catch (error) {
    if (error instanceof Error)
      dispatch(addNotification(error.message, true))

    dispatch(addArtistFailure(error))
  }
}

export const updateArtist = (): AppThunk => async (dispatch, getState) => {
  dispatch(updateArtistRequest())

  const { name, slug, image, id } = getState().adminArtist
  const artist = { name, slug, image }

  try {
    Validator.validateArtist(artist)
    await Utils.request('/admin/updateArtist', { artist, id })
    dispatch(addNotification('Artist updated!'))
    dispatch(updateArtistSuccess())
  } catch (error) {
    if (error instanceof Error)
      dispatch(addNotification(error.message, true))
      
    dispatch(updateArtistFailure(error))
  }
}

export const initialise = (artistId: any): AppThunk => async dispatch => {
  dispatch(initialiseRequest())

  try {
    Validator.validateId(artistId)
    const artist = await Utils.request('/admin/getArtist', { artistId })
    dispatch(initialiseSuccess(artist))
  } catch (error) {
    dispatch(addNotification(error.message, true))
    dispatch(initialiseFailure(error))
  }
}

export const deleteArtist = (): AppThunk => async (dispatch, getState) => {
  dispatch(deleteArtistRequest())

  const { id } = getState().adminArtist

  try {
    await Utils.request('/admin/deleteArtist', { id })
    dispatch(addNotification('Artist deleted!'))
    dispatch(deleteArtistSuccess())
  } catch (error) {
    dispatch(addNotification(error.message, true))      
    dispatch(deleteArtistFailure(error))
  }
}