import { ArtistType } from '../artist/types'

export const GET_ALBUM_REQUEST = 'album/GET_ALBUM_REQUEST'
export const GET_ALBUM_SUCCESS = 'album/GET_ALBUM_SUCCESS'
export const GET_ALBUM_FAILURE = 'album/GET_ALBUM_FAILURE'

export interface AlbumType {
  id: string,
  artist: ArtistType,
  name: string,
  image: string,
  year: string,
  slug: string,
  tracklist: Array<{
    id: string,
    number: string,
    name: string,
    lengthSeconds: string,
  }>,
}

export interface AlbumState {
  loading: boolean,
  album: AlbumType | null,
  slug: string | null,
  error: string | null,
}

interface GetAlbumRequestAction {
  type: typeof GET_ALBUM_REQUEST,
}

interface GetAlbumSuccessAction {
  type: typeof GET_ALBUM_SUCCESS,
  payload: { album: AlbumType },
  meta: { slug: string },
}

interface GetAlbumFailureAction {
  type: typeof GET_ALBUM_FAILURE,
  payload: { error: Error },
}

export type AlbumActions =
  | GetAlbumRequestAction
  | GetAlbumSuccessAction
  | GetAlbumFailureAction