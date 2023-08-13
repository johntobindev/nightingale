import { 
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  ADD_ALBUM_REQUEST,
  ADD_ALBUM_SUCCESS,
  ADD_ALBUM_FAILURE,
  UPDATE_ALBUM_REQUEST,
  UPDATE_ALBUM_SUCCESS,
  UPDATE_ALBUM_FAILURE,
  AdminAlbumActions,
  ArtistsType,
  SET_VALUE,
  ADD_TRACK,
  DELETE_TRACK,
  EDIT_TRACK,
  AdminAlbumState,
  MOVE_UP,
  MOVE_DOWN,
  INITIALISE_REQUEST,
  INITIALISE_SUCCESS,
  INITIALISE_FAILURE,
  RESET,
  DELETE_ALBUM_REQUEST,
  DELETE_ALBUM_SUCCESS,
  DELETE_ALBUM_FAILURE,
} from './types'
import { AppThunk } from '../types'
import Utils from '../Utils'
import Validator from '../../../api/Albums/Validator'
import { AlbumType } from '../album/types'
import { addNotification } from '../notifications/actions'

const uploadImageRequest = (): AdminAlbumActions => ({
  type: UPLOAD_IMAGE_REQUEST,
})

const uploadImageSuccess = (
  image: string,
): AdminAlbumActions => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: { image },
})

const uploadImageFailure = (
  error: Error,
): AdminAlbumActions => ({
  type: UPLOAD_IMAGE_FAILURE,
  payload: { error },
})

const addAlbumRequest = (): AdminAlbumActions => ({ 
  type: ADD_ALBUM_REQUEST,
})

const addAlbumSuccess = (): AdminAlbumActions => ({
  type: ADD_ALBUM_SUCCESS,
})

const addAlbumFailure = (
  error: Error | AdminAlbumState['errors'],
): AdminAlbumActions => ({
  type: ADD_ALBUM_FAILURE,
  payload: { error },
})

const updateAlbumRequest = (): AdminAlbumActions => ({ 
  type: UPDATE_ALBUM_REQUEST,
})

const updateAlbumSuccess = (): AdminAlbumActions => ({
  type: UPDATE_ALBUM_SUCCESS,
})

const updateAlbumFailure = (
  error: Error | AdminAlbumState['errors'],
): AdminAlbumActions => ({
  type: UPDATE_ALBUM_FAILURE,
  payload: { error },
})

const initialiseRequest = (): AdminAlbumActions => ({
  type: INITIALISE_REQUEST,
})

const initialiseSuccess = (
  artists: ArtistsType,
  album?: AlbumType,
): AdminAlbumActions => ({
  type: INITIALISE_SUCCESS,
  payload: { artists, album },
})

const initialiseFailure = (
  error: Error,
): AdminAlbumActions => ({
  type: INITIALISE_FAILURE,
  payload: { error },
})

export const setValue = (
  name: string,
  value: string,
): AdminAlbumActions => ({
  type: SET_VALUE,
  payload: { value },
  meta: { name },
})

export const addTrack = (): AdminAlbumActions => ({ type: ADD_TRACK })

export const deleteTrack = (
  key: number,
  id: string | null,
): AdminAlbumActions => ({
  type: DELETE_TRACK,
  meta: { key, id },
})

export const editTrack = (
  key: number,
  name: string,
  value: string,
): AdminAlbumActions => ({
  type: EDIT_TRACK,
  payload: { value },
  meta: { key, name },
})

export const moveUp = (key: number): AdminAlbumActions => ({
  type: MOVE_UP,
  meta: { key },
})

export const moveDown = (key: number): AdminAlbumActions => ({
  type: MOVE_DOWN,
  meta: { key },
})

const deleteAlbumRequest = (): AdminAlbumActions => ({ 
  type: DELETE_ALBUM_REQUEST,
})

const deleteAlbumSuccess = (): AdminAlbumActions => ({
  type: DELETE_ALBUM_SUCCESS,
})

const deleteAlbumFailure = (
  error: Error,
): AdminAlbumActions => ({
  type: DELETE_ALBUM_FAILURE,
  payload: { error },
})

export const uploadImage = (file: File): AppThunk => async dispatch => {
  dispatch(uploadImageRequest())

  try {
    Validator.validateImageClientSide(file)
    let fd = new FormData()
    fd.append('file', file)  
    const uploadedName = await Utils.request('/admin/uploadImage', fd, true)
    dispatch(uploadImageSuccess(uploadedName))
  } catch (error) {
    dispatch(uploadImageFailure(error))
  }
}

export const addAlbum = (): AppThunk => async (dispatch, getState) => {
  dispatch(addAlbumRequest())

  const { name, slug, year, artistId, tracks, image } = getState().adminAlbum
  const album = { name, slug, year, artistId, tracks, image }

  try {
    Validator.validateAlbum(album)
    await Utils.request('/admin/addAlbum', { album })
    dispatch(addNotification('Album added!'))
    dispatch(addAlbumSuccess())
  } catch (error) {
    if (error instanceof Error)
      dispatch(addNotification(error.message, true))

    dispatch(addAlbumFailure(error))
  }
}

export const updateAlbum = (): AppThunk => async (dispatch, getState) => {
  dispatch(updateAlbumRequest())

  const { name, slug, year, artistId, tracks, image, id, deletedTracks } = getState().adminAlbum
  const album = { name, slug, year, artistId, tracks, image }

  try {
    Validator.validateAlbum(album)
    Validator.validateId(id)
    Validator.validateDeletedTracks(deletedTracks)
    await Utils.request('/admin/updateAlbum', { album, id, deletedTracks })
    dispatch(addNotification('Album updated!'))
    dispatch(updateAlbumSuccess())
  } catch (error) {
    if (error instanceof Error)
      dispatch(addNotification(error.message, true))
      
    dispatch(updateAlbumFailure(error))
  }
}

export const initialise = (albumId?: any): AppThunk => async dispatch => {
  dispatch(initialiseRequest())

  try {
    let promises = [Utils.request('/admin/getArtists')]

    if (albumId !== undefined) {
      Validator.validateId(albumId)
      promises.push(Utils.request('/admin/getAlbum', { albumId }))
      const [ artists, album ] = await Promise.all(promises)
      dispatch(initialiseSuccess(artists, album))
    } else {
      const [ artists ] = await Promise.all(promises)
      dispatch(initialiseSuccess(artists))
    }
  } catch (error) {
    dispatch(addNotification(error.message, true))      
    dispatch(initialiseFailure(error))
  }
}

export const reset = (): AdminAlbumActions => ({
  type: RESET,
})

export const deleteAlbum = (): AppThunk => async (dispatch, getState) => {
  dispatch(deleteAlbumRequest())

  const { id } = getState().adminAlbum

  try {
    await Utils.request('/admin/deleteAlbum', { id })
    dispatch(addNotification('Album deleted!'))
    dispatch(deleteAlbumSuccess())
  } catch (error) {
    dispatch(addNotification(error.message, true))      
    dispatch(deleteAlbumFailure(error))
  }
}