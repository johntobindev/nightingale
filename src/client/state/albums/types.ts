import { PreparedOptions } from '../../../api/Albums/Validator'
import { AlbumType } from '../album/types'

export const GET_ALBUMS_REQUEST = 'albums/GET_ALBUMS_REQUEST'
export const GET_ALBUMS_SUCCESS = 'albums/GET_ALBUMS_SUCCESS'
export const GET_ALBUMS_FAILURE = 'albums/GET_ALBUMS_FAILURE'

export interface AlbumsState {
  loading: boolean,
  initialised: boolean,
  numAlbums: number,
  albums: AlbumType[],
  options: PreparedOptions,
  error: string | null,
}

interface GetAlbumsRequestAction {
  type: typeof GET_ALBUMS_REQUEST,
  meta: { getPage: boolean },
}

interface GetAlbumsSuccessAction {
  type: typeof GET_ALBUMS_SUCCESS,
  payload: {
    albums: AlbumType[],
    numAlbums: number,
  },
  meta: {
    getPage: boolean,
    options: AlbumsState['options'],
  },
}

interface GetAlbumsFailureAction {
  type: typeof GET_ALBUMS_FAILURE,
  payload: { error: Error },
}

export type AlbumsActions =
  | GetAlbumsRequestAction
  | GetAlbumsSuccessAction
  | GetAlbumsFailureAction