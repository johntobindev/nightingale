import { AlbumType } from '../album/types'

export const INITIALISE_REQUEST = 'adminAlbum/INITIALISE_REQUEST'
export const INITIALISE_SUCCESS = 'adminAlbum/INITIALISE_SUCCESS'
export const INITIALISE_FAILURE = 'adminAlbum/INITIALISE_FAILURE'
export const RESET = 'adminAlbum/RESET'

export const UPLOAD_IMAGE_REQUEST = 'adminAlbum/UPLOAD_IMAGE_REQUEST'
export const UPLOAD_IMAGE_SUCCESS = 'adminAlbum/UPLOAD_IMAGE_SUCCESS'
export const UPLOAD_IMAGE_FAILURE = 'adminAlbum/UPLOAD_IMAGE_FAILURE'

export const ADD_ALBUM_REQUEST = 'adminAlbum/ADD_ALBUM_REQUEST'
export const ADD_ALBUM_SUCCESS = 'adminAlbum/ADD_ALBUM_SUCCESS'
export const ADD_ALBUM_FAILURE = 'adminAlbum/ADD_ALBUM_FAILURE'

export const UPDATE_ALBUM_REQUEST = 'adminAlbum/UPDATE_ALBUM_REQUEST'
export const UPDATE_ALBUM_SUCCESS = 'adminAlbum/UPDATE_ALBUM_SUCCESS'
export const UPDATE_ALBUM_FAILURE = 'adminAlbum/UPDATE_ALBUM_FAILURE'

export const DELETE_ALBUM_REQUEST = 'adminAlbum/DELETE_ALBUM_REQUEST'
export const DELETE_ALBUM_SUCCESS = 'adminAlbum/DELETE_ALBUM_SUCCESS'
export const DELETE_ALBUM_FAILURE = 'adminAlbum/DELETE_ALBUM_FAILURE'

export const SET_VALUE = 'adminAlbum/SET_VALUE'
export const ADD_TRACK = 'adminAlbum/ADD_TRACK'
export const DELETE_TRACK = 'adminAlbum/DELETE_TRACK'
export const EDIT_TRACK = 'adminAlbum/EDIT_TRACK'
export const MOVE_UP = 'adminAlbum/MOVE_UP'
export const MOVE_DOWN = 'adminAlbum/MOVE_DOWN'

export type ArtistsType = {
  id: string,
  name: string,
}[]

export interface ErrorsType {
  name: string | null,
  slug: string | null,
  year: string | null,
  tracks: {
    name: string | null,
    lengthSeconds: string | null,
  }[],
  image: string | null,
}

export interface AdminAlbumState {
  initialised: boolean,
  loading: boolean,
  error: string | null,
  errors: ErrorsType,
  uploading: boolean,
  image: string | null,
  name: string,
  slug: string,
  year: string,
  artistId: string,
  tracks: {
    number: string,
    name: string,
    lengthSeconds: string,
    id?: string,
  }[],
  artists: ArtistsType | null,
  id: string | null,
  deletedTracks: string[],
  isDeleted: boolean,
}

interface InitialiseRequestAction {
  type: typeof INITIALISE_REQUEST,
}

interface InitialiseSuccessAction {
  type: typeof INITIALISE_SUCCESS,
  payload: {
    artists: ArtistsType,
    album?: AlbumType,
  },
}

interface InitialiseFailureAction {
  type: typeof INITIALISE_FAILURE,
  payload: { error: Error },
}

interface ResetAction {
  type: typeof RESET,
}

interface UploadImageRequestAction {
  type: typeof UPLOAD_IMAGE_REQUEST,
}

interface UploadImageSuccessAction {
  type: typeof UPLOAD_IMAGE_SUCCESS,
  payload: { image: string },
}

interface UploadImageFailureAction {
  type: typeof UPLOAD_IMAGE_FAILURE,
  payload: { error: Error },
}

interface AdminAlbumRequestAction {
  type: typeof ADD_ALBUM_REQUEST,
}

interface AdminAlbumSuccessAction {
  type: typeof ADD_ALBUM_SUCCESS,
}

interface AdminAlbumFailureAction {
  type: typeof ADD_ALBUM_FAILURE,
  payload: { error: Error | AdminAlbumState['errors'] },
}

interface UpdateAlbumRequestAction {
  type: typeof UPDATE_ALBUM_REQUEST,
}

interface UpdateAlbumSuccessAction {
  type: typeof UPDATE_ALBUM_SUCCESS,
}

interface UpdateAlbumFailureAction {
  type: typeof UPDATE_ALBUM_FAILURE,
  payload: { error: Error | AdminAlbumState['errors'] },
}

interface SetValueAction {
  type: typeof SET_VALUE,
  payload: { value: string },
  meta: { name: string },
}

interface AddTrackAction { type: typeof ADD_TRACK }

interface DeleteTrackAction {
  type: typeof DELETE_TRACK,
  meta: {
    key: number,
    id: string | null,
  },
}

interface EditTrackAction {
  type: typeof EDIT_TRACK,
  payload: { value: string },
  meta: {
    key: number,
    name: string,
  }
}

interface MoveUpAction {
  type: typeof MOVE_UP,
  meta: { key: number }
}

interface MoveDownAction {
  type: typeof MOVE_DOWN,
  meta: { key: number }
}

interface DeleteAlbumRequestAction {
  type: typeof DELETE_ALBUM_REQUEST,
}

interface DeleteAlbumSuccessAction {
  type: typeof DELETE_ALBUM_SUCCESS,
}

interface DeleteAlbumFailureAction {
  type: typeof DELETE_ALBUM_FAILURE,
  payload: { error: Error },
}

export type AdminAlbumActions =
  | InitialiseRequestAction
  | InitialiseSuccessAction
  | InitialiseFailureAction
  | ResetAction
  | UploadImageRequestAction
  | UploadImageSuccessAction
  | UploadImageFailureAction
  | AdminAlbumRequestAction
  | AdminAlbumSuccessAction
  | AdminAlbumFailureAction
  | UpdateAlbumRequestAction
  | UpdateAlbumSuccessAction
  | UpdateAlbumFailureAction
  | SetValueAction
  | AddTrackAction
  | DeleteTrackAction
  | EditTrackAction
  | MoveUpAction
  | MoveDownAction
  | DeleteAlbumRequestAction
  | DeleteAlbumSuccessAction
  | DeleteAlbumFailureAction