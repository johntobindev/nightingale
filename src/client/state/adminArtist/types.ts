import { ArtistType } from '../artist/types'

export const INITIALISE_REQUEST = 'adminArtist/INITIALISE_REQUEST'
export const INITIALISE_SUCCESS = 'adminArtist/INITIALISE_SUCCESS'
export const INITIALISE_FAILURE = 'adminArtist/INITIALISE_FAILURE'
export const RESET = 'adminArtist/RESET'

export const UPLOAD_IMAGE_REQUEST = 'adminArtist/UPLOAD_IMAGE_REQUEST'
export const UPLOAD_IMAGE_SUCCESS = 'adminArtist/UPLOAD_IMAGE_SUCCESS'
export const UPLOAD_IMAGE_FAILURE = 'adminArtist/UPLOAD_IMAGE_FAILURE'

export const ADD_ARTIST_REQUEST = 'adminArtist/ADD_ARTIST_REQUEST'
export const ADD_ARTIST_SUCCESS = 'adminArtist/ADD_ARTIST_SUCCESS'
export const ADD_ARTIST_FAILURE = 'adminArtist/ADD_ARTIST_FAILURE'

export const DELETE_ARTIST_REQUEST = 'adminArtist/DELETE_ARTIST_REQUEST'
export const DELETE_ARTIST_SUCCESS = 'adminArtist/DELETE_ARTIST_SUCCESS'
export const DELETE_ARTIST_FAILURE = 'adminArtist/DELETE_ARTIST_FAILURE'

export const UPDATE_ARTIST_REQUEST = 'adminArtist/UPDATE_ARTIST_REQUEST'
export const UPDATE_ARTIST_SUCCESS = 'adminArtist/UPDATE_ARTIST_SUCCESS'
export const UPDATE_ARTIST_FAILURE = 'adminArtist/UPDATE_ARTIST_FAILURE'

export const SET_VALUE = 'adminArtist/SET_VALUE'

export interface ErrorsType {
  name: string | null,
  slug: string | null,  
  image: string | null,
}

export interface AdminArtistState {
  initialised: boolean,
  loading: boolean,
  error: string | null,
  errors: ErrorsType,
  uploading: boolean,
  image: string | null,
  name: string,
  slug: string,
  id: string | null,
  isDeleted: boolean,
}

interface InitialiseRequestAction {
  type: typeof INITIALISE_REQUEST,
}

interface InitialiseSuccessAction {
  type: typeof INITIALISE_SUCCESS,
  payload: { artist: ArtistType }
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

interface AdminArtistRequestAction {
  type: typeof ADD_ARTIST_REQUEST,
}

interface AdminArtistSuccessAction {
  type: typeof ADD_ARTIST_SUCCESS,
}

interface AdminArtistFailureAction {
  type: typeof ADD_ARTIST_FAILURE,
  payload: { error: Error | AdminArtistState['errors'] },
}

interface UpdateArtistRequestAction {
  type: typeof UPDATE_ARTIST_REQUEST,
}

interface UpdateArtistSuccessAction {
  type: typeof UPDATE_ARTIST_SUCCESS,
}

interface UpdateArtistFailureAction {
  type: typeof UPDATE_ARTIST_FAILURE,
  payload: { error: Error | AdminArtistState['errors'] },
}

interface SetValueAction {
  type: typeof SET_VALUE,
  payload: { value: string },
  meta: { name: string },
}

interface DeleteArtistRequestAction {
  type: typeof DELETE_ARTIST_REQUEST,
}

interface DeleteArtistSuccessAction {
  type: typeof DELETE_ARTIST_SUCCESS,
}

interface DeleteArtistFailureAction {
  type: typeof DELETE_ARTIST_FAILURE,
  payload: { error: Error },
}

export type AdminArtistActions =
  | InitialiseRequestAction
  | InitialiseSuccessAction
  | InitialiseFailureAction
  | ResetAction
  | UploadImageRequestAction
  | UploadImageSuccessAction
  | UploadImageFailureAction
  | AdminArtistRequestAction
  | AdminArtistSuccessAction
  | AdminArtistFailureAction
  | UpdateArtistRequestAction
  | UpdateArtistSuccessAction
  | UpdateArtistFailureAction
  | SetValueAction
  | DeleteArtistRequestAction
  | DeleteArtistSuccessAction
  | DeleteArtistFailureAction