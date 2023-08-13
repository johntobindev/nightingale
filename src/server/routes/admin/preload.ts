import { Request, Response, NextFunction } from 'express'
import Albums from '../../../api/Albums'
import Artists from '../../../api/Artists'
import { initialState as initialStateAdminAlbum } from '../../../client/state/adminAlbum/reducer'
import { initialState as initialStateAdminArtist } from '../../../client/state/adminArtist/reducer'
import { ErrorsType } from '../../../client/state/adminAlbum/types'
import Utils from '../Utils'

export const preloadAddAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let adminAlbumState = { ...initialStateAdminAlbum }

  try {
    const artists = await Artists.getArtists()
    adminAlbumState = { ...adminAlbumState, artists, initialised: true }
  } catch (error) {
    return next()
  }

  Utils.mergeToPreloadedState(req, {
    adminAlbum: adminAlbumState,
  })

  next()
}

export const preloadUpdateAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { albumId } = req.params
  let adminAlbumState = { ...initialStateAdminAlbum }

  try {
    const artists = await Artists.getArtists()
    const album = await Albums.getAlbumById(albumId)

    adminAlbumState = {
      ...adminAlbumState,
      artists,
      initialised: true,
      image: album.image,
      name: album.name,
      slug: album.slug,
      year: album.year,
      artistId: album.artist.id,
      tracks: album.tracklist,
      id: album.id,
    }

    let trackErrors: ErrorsType['tracks'] = []

    for (let i = 0; i < album.tracklist.length; i++)
      trackErrors.push({
        name: null,
        lengthSeconds: null,
      })

    adminAlbumState = {
      ...adminAlbumState,
      errors: {
        ...adminAlbumState.errors,
        tracks: trackErrors,
      },
    }
  } catch (error) {
    return next()
  }

  Utils.mergeToPreloadedState(req, {
    adminAlbum: adminAlbumState,
  })

  next()
}

export const preloadUpdateArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { artistId } = req.params
  let adminArtistState = { ...initialStateAdminArtist }

  try {
    const artist = await Artists.getArtistById(artistId)

    adminArtistState = {
      ...adminArtistState,
      initialised: true,
      image: artist.image,
      name: artist.name,
      slug: artist.slug,
      id: artist.id,
    }
  } catch (error) {
    return next()
  }

  Utils.mergeToPreloadedState(req, {
    adminArtist: adminArtistState,
  })

  next()
}