import { Request, Response, NextFunction } from 'express'
import Artists from '../../../api/Artists'
import Albums from '../../../api/Albums'
import AlbumsValidator, { ValidOptions } from '../../../api/Albums/Validator'
import { initialState as initialStateArtist } from '../../../client/state/artist/reducer'
import { initialState as initialStateAlbums } from '../../../client/state/albums/reducer'
import Utils from '../Utils'
import ClientSafeError from '../../../global/ClientSafeError'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { artist: artistSlug } = req.params

  let artistState = { ...initialStateArtist, slug: artistSlug }

  const options = AlbumsValidator.prepareOptions({ ...req.query, artistSlug })
  let albumsState = { ...initialStateAlbums, options, initialised: true }

  try {
    const artist = await Artists.getArtist(artistSlug)
    artistState = { ...artistState, artist }
  } catch (error) {
    if (error instanceof ClientSafeError)
      artistState = { ...artistState, error: error.message }
  }

  try {
    AlbumsValidator.validateOptions(options)
    const numAlbums = await Albums.getNumAlbums(options as ValidOptions)
    const albums = await Albums.getAlbums(options as ValidOptions)
    albumsState = { ...albumsState, numAlbums, albums, options }
  } catch (error) {
    albumsState = { ...albumsState, error: error.message }
  }

  Utils.mergeToPreloadedState(req, {
    artist: artistState,
    albums: albumsState,
  })

  next()
}