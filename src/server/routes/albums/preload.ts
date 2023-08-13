import { Request, Response, NextFunction } from 'express'
import Albums from '../../../api/Albums'
import AlbumsValidator, { ValidOptions } from '../../../api/Albums/Validator'
import Artists from '../../../api/Artists'
import { initialState as initialStateArtist } from '../../../client/state/artist/reducer'
import { initialState as initialStateAlbum } from '../../../client/state/album/reducer'
import { initialState as initialStateAlbums } from '../../../client/state/albums/reducer'
import Utils from '../Utils'

export const preloadAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { artist: artistSlug, album: albumSlug } = req.params

  let artistState = { ...initialStateArtist, slug: artistSlug }
  let albumState = { ...initialStateAlbum, slug: albumSlug }

  try {
    const artist = await Artists.getArtist(artistSlug)
    artistState = { ...artistState, artist, slug: artistSlug }
  } catch(error) {
    artistState = { ...artistState, error: error.message }
  }

  try {
    const album = await Albums.getAlbum(artistSlug, albumSlug)
    albumState = { ...albumState, album, slug: albumSlug }
  } catch (error) {
    albumState = { ...albumState, error: error.message }
  }

  Utils.mergeToPreloadedState(req, {
    artist: artistState,
    album: albumState,
  })

  next()
}

export const preloadAlbums = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const options = AlbumsValidator.prepareOptions(req.query)
  let albumsState = { ...initialStateAlbums, options, initialised: true }

  try {
    AlbumsValidator.validateOptions(options)
    const numAlbums = await Albums.getNumAlbums(options as ValidOptions)
    const albums = await Albums.getAlbums(options as ValidOptions)
    albumsState = { ...albumsState, numAlbums, albums, options }
  } catch (error) {
    albumsState = { ...albumsState, error: error.message }
  }

  Utils.mergeToPreloadedState(req, {
    albums: albumsState,
  })

  next()
}