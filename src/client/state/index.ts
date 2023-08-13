import { combineReducers } from 'redux'

import session from './session/reducer'
import userSettings from './userSettings/reducer'
import wrapper from './wrapper/reducer'
import overlays from './overlays/reducer'
import album from './album/reducer'
import albums from './albums/reducer'
import artist from './artist/reducer'
import adminAlbum from './adminAlbum/reducer'
import adminArtist from './adminArtist/reducer'
import notifications from './notifications/reducer'

export const rootReducer = combineReducers({
  session,
  userSettings,
  wrapper,
  overlays,
  album,
  albums,
  artist,
  adminAlbum,
  adminArtist,
  notifications,
})

export type RootState = ReturnType<typeof rootReducer>