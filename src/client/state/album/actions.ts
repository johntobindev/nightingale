import {
  GET_ALBUM_REQUEST,
  GET_ALBUM_SUCCESS,
  GET_ALBUM_FAILURE,
  AlbumActions,
  AlbumType,
} from './types'
import { AppThunk } from '../types'
import Utils from '../Utils'

const getAlbumRequest = (): AlbumActions => ({ type: GET_ALBUM_REQUEST })

const getAlbumSuccess = (
  album: AlbumType,
  slug: string,
): AlbumActions => ({
  type: GET_ALBUM_SUCCESS,
  payload: { album },
  meta: { slug },
})

const getAlbumFailure = (
  error: Error,
): AlbumActions => ({
  type: GET_ALBUM_FAILURE,
  payload: { error: error },
})

export const getAlbum = (
  artistSlug: string,
  albumSlug: string,
): AppThunk => async dispatch => {
  dispatch(getAlbumRequest())

  try {
    const album = await Utils.request('/albums/getAlbum', { artistSlug, albumSlug })
    dispatch(getAlbumSuccess(album, albumSlug))
  } catch (error) {
    dispatch(getAlbumFailure(error))
  }
}