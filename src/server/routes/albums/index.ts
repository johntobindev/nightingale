import Albums from '../../../api/Albums'
import Utils from '../Utils'
//import Auth from '../../../global/Auth'
import { Application as App } from 'express'
import Validator from '../../../api/Albums/Validator'
import {
  preloadAlbum,
  preloadAlbums,
} from './preload'

export default (app: App) => {
  app.get('/:artist/:album', preloadAlbum)

  app.get('/', preloadAlbums)

  app.post(
    '/albums/getAlbum',
    Utils.requireParams('artistSlug', 'albumSlug'),
    async (req, res) => {
      const { artistSlug, albumSlug } = req.body

      try {
        Validator.validateParams({ artistSlug, albumSlug })
        const album = await Albums.getAlbum(artistSlug, albumSlug)
        Utils.handleSuccess(res, album)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/albums/getAlbums',
    async (req, res) => {
      let { options } = req.body
      options = Validator.prepareOptions(options)

      try {
        Validator.validateOptions(options)
        const numAlbums = await Albums.getNumAlbums(options)
        const albums = await Albums.getAlbums(options)
        Utils.handleSuccess(res, { numAlbums, albums })
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )
}