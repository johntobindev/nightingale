import {
  GET_ALBUMS_REQUEST,
  GET_ALBUMS_SUCCESS,
  GET_ALBUMS_FAILURE,
  AlbumsActions,
  AlbumsState,
} from './types'
import { AlbumType } from '../album/types'
import { AppThunk } from '../types'
import Utils from '../Utils'
import Validator from '../../../api/Albums/Validator'

const getAlbumsRequest = (
  getPage: boolean,
): AlbumsActions => ({
  type: GET_ALBUMS_REQUEST,
  meta: { getPage },
})

const getAlbumsSuccess = (
  albums: AlbumType[],
  numAlbums: number,
  getPage: boolean,
  options: AlbumsState['options'],
): AlbumsActions => ({
  type: GET_ALBUMS_SUCCESS,
  payload: { albums, numAlbums },
  meta: { getPage, options },
})

const getAlbumsFailure = (
  error: Error,
): AlbumsActions => ({
  type: GET_ALBUMS_FAILURE,
  payload: { error: error },
})

export const getAlbums = (
  artistSlug: any,
  sortBy: any,
  decade: any,
  search: any,
  page?: any,
): AppThunk => async dispatch => {
  const getPage = page !== undefined

  dispatch(getAlbumsRequest(getPage))

  const options = Validator.prepareOptions({
    artistSlug,
    sortBy,
    decade,
    search,
    page,
  })

  try {
    Validator.validateOptions(options)
    const response = await Utils.request('/albums/getAlbums', { options })
    dispatch(getAlbumsSuccess(response.albums, response.numAlbums, getPage, options))
  } catch (error) {
    dispatch(getAlbumsFailure(error))
  }
}