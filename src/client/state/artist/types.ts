export const GET_ARTIST_REQUEST = 'artist/GET_ARTIST_REQUEST'
export const GET_ARTIST_SUCCESS = 'artist/GET_ARTIST_SUCCESS'
export const GET_ARTIST_FAILURE = 'artist/GET_ARTIST_FAILURE'

export interface ArtistType {
  id: string,
  name: string,
  image: string,
  slug: string,
}

export interface ArtistState {
  loading: boolean,
  artist: ArtistType | null,
  slug: string | null,
  error: string | null,
}

interface GetArtistRequestAction {
  type: typeof GET_ARTIST_REQUEST,
}

interface GetArtistSuccessAction {
  type: typeof GET_ARTIST_SUCCESS,
  payload: { artist: ArtistType },
  meta: { slug: string },
}

interface GetArtistFailureAction {
  type: typeof GET_ARTIST_FAILURE,
  payload: { error: Error },
}

export type ArtistActions =
  | GetArtistRequestAction
  | GetArtistSuccessAction
  | GetArtistFailureAction