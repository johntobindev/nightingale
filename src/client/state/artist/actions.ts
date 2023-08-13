import {
  GET_ARTIST_REQUEST,
  GET_ARTIST_SUCCESS,
  GET_ARTIST_FAILURE,
  ArtistActions,
  ArtistType,
} from './types'
import { AppThunk } from '../types'
import Utils from '../Utils'

const getArtistRequest = (): ArtistActions => ({ type: GET_ARTIST_REQUEST })

const getArtistSuccess = (
  artist: ArtistType,
  slug: string,
): ArtistActions => ({
  type: GET_ARTIST_SUCCESS,
  payload: { artist },
  meta: { slug },
})

const getArtistFailure = (
  error: Error,
): ArtistActions => ({
  type: GET_ARTIST_FAILURE,
  payload: { error: error },
})

export const getArtist = (artistSlug: string): AppThunk => async dispatch => {
  dispatch(getArtistRequest())

  try {
    const artist = await Utils.request('/artists/getArtist', { artistSlug })
    dispatch(getArtistSuccess(artist, artistSlug))
  } catch (error) {
    dispatch(getArtistFailure(error))
  }
}