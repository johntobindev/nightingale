import Albums from '../../../api/Albums'
import Artists from '../../../api/Artists'
import Utils from '../Utils'
//import Auth from '../../../global/Auth'
import { Application as App } from 'express'
import FileType from 'file-type'
import messages from '../../../global/messages'
import sharp from 'sharp'
import { fileLimits } from '../../../api/Albums/Validator'
import multer from 'multer'
import AlbumsValidator from '../../../api/Albums/Validator'
import ArtistsValidator from '../../../api/Artists/Validator'
import {
  preloadAddAlbum,
  preloadUpdateAlbum,
  preloadUpdateArtist,
} from './preload'

const upload = multer({
  dest: __dirname + '../../../../../static/images/uploads',
  limits: {
    fileSize: fileLimits.size,
  },
  fileFilter: (req, file, cb) => {
    if (!fileLimits.types.includes(file.mimetype))
      return cb(new Error(messages.INVALID_FILE_TYPE))

    cb(null, true)
  },
})

export default (app: App) => {
  app.get('/admin/add-album', preloadAddAlbum)

  app.get('/admin/edit-album/:albumId', preloadUpdateAlbum)

  app.get('/admin/edit-artist/:artistId', preloadUpdateArtist)

  app.post(
    '/admin/addAlbum',
    Utils.requireParams('album'),
    async (req, res) => {
      const { album } = req.body

      try {
        AlbumsValidator.validateAlbum(album)
        await Albums.addAlbum(album)
        Utils.handleSuccess(res)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/getAlbum',
    Utils.requireParams('albumId'),
    async (req, res) => {
      const { albumId } = req.body

      try {
        AlbumsValidator.validateId(albumId)
        const album = await Albums.getAlbumById(albumId)
        Utils.handleSuccess(res, album)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/updateAlbum',
    Utils.requireParams('album', 'id'),
    async (req, res) => {
      const { album, id, deletedTracks } = req.body

      try {
        AlbumsValidator.validateAlbum(album)
        AlbumsValidator.validateId(id)
        AlbumsValidator.validateDeletedTracks(deletedTracks)
        await Albums.updateAlbum(album, id, deletedTracks)
        Utils.handleSuccess(res)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/deleteAlbum',
    Utils.requireParams('id'),
    async (req, res) => {
      const { id } = req.body

      try {
        AlbumsValidator.validateId(id)
        await Albums.deleteAlbum(id)
        Utils.handleSuccess(res)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/addArtist',
    Utils.requireParams('artist'),
    async (req, res) => {
      const { artist } = req.body

      try {
        ArtistsValidator.validateArtist(artist)
        await Artists.addArtist(artist)
        Utils.handleSuccess(res)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/getArtist',
    Utils.requireParams('artistId'),
    async (req, res) => {
      const { artistId } = req.body

      try {
        ArtistsValidator.validateId(artistId)
        const artist = await Artists.getArtistById(artistId)
        Utils.handleSuccess(res, artist)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/updateArtist',
    Utils.requireParams('artist', 'id'),
    async (req, res) => {
      const { artist, id } = req.body

      try {
        ArtistsValidator.validateArtist(artist)
        ArtistsValidator.validateId(id)
        await Artists.updateArtist(artist, id)
        Utils.handleSuccess(res)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/deleteArtist',
    Utils.requireParams('id'),
    async (req, res) => {
      const { id } = req.body

      try {
        ArtistsValidator.validateId(id)
        await Artists.deleteArtist(id)
        Utils.handleSuccess(res)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/getArtists',
    async (req, res) => {
      try {
        const artists = await Artists.getArtists()
        Utils.handleSuccess(res, artists)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/admin/uploadImage',
    (req, res, next) => upload.single('file')(req, res, error => {
      // The only MulterError we are concerned about here is about file size
      if (error instanceof multer.MulterError)
        return Utils.handleError(res, new Error(messages.INVALID_FILE_SIZE))
      else if (error)
        return Utils.handleError(res, error)

      next()
    }),
    async (req, res) => {
      try {
        if (req.file === undefined) throw new Error(messages.STANDARD_ERROR)

        const { filename } = req.file
        const path = `${__dirname}/../../../../static/images/uploads/${filename}`
        const meta = await FileType.fromFile(path)

        if (meta === undefined || !fileLimits.types.includes(meta.mime))
          return Utils.handleError(res, new Error(messages.INVALID_FILE_TYPE))

        // File good, resize it
        await sharp(path).resize(800, 800).toFile(path + '_800')
        await sharp(path).resize(400, 400).toFile(path + '_400')

        Utils.handleSuccess(res, filename)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )
}