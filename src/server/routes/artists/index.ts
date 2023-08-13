import Artists from '../../../api/Artists'
import Validator from '../../../api/Artists/Validator'
import Utils from '../Utils'
//import Auth from '../../../global/Auth'
import { Application as App } from 'express'
import preload from './preload'

export default (app: App) => {
  app.get('/:artist', preload)

  app.post(
    '/artists/getArtist',
    Utils.requireParams('artistSlug'),
    async (req, res) => {
      const { artistSlug } = req.body

      try {
        Validator.validateParams({ artistSlug })
        const artist = await Artists.getArtist(artistSlug)
        Utils.handleSuccess(res, artist)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )
}