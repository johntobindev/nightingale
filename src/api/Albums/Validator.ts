import { ErrorsType } from '../../client/state/adminAlbum/types'
import messages from '../../global/messages'
import Utils from '../../global/Utils'
import qs from 'qs'

export const perPage = 12
export const fileLimits = {
  size: 350 * 1024,
  types: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ],
}

// Duplication of data currently required for typings
type ValidSortByType = 'year-asc'|'album-asc'|'album-desc'|'artist-desc'|'artist-asc'
export const validSortBy = ['year-asc', 'album-asc', 'album-desc', 'artist-asc', 'artist-desc']
type ValidDecades = '1950'|'1960'|'1970'|'1980'|'1990'|'2000'|'2010'|'2020'
export const validDecades = ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020']

export const getQueryOptions = (search: string) => (
  qs.parse(search, { ignoreQueryPrefix: true })
)

export const createUrl = (pathname: string, queryOptions: qs.ParsedQs) => (
  pathname + qs.stringify(queryOptions, { addQueryPrefix: true })
)

export interface PreparedOptions {
  artistSlug: string | null,
  sortBy: string | null,
  decade: string | null,
  search: string | null,
  page: string | null,
}

export interface ValidOptions extends PreparedOptions {
  sortBy: ValidSortByType | null,
  decade: ValidDecades | null,
}

export interface ValidAlbum {
  name: string,
  slug: string,
  year: string,
  artistId: string,
  tracks: {
    id?: string,
    number: string,
    name: string,
    lengthSeconds: string,
  }[],
  image: string,
}

const setValue = (value: any): string | null => (
  (typeof value === 'string' && value.length > 0) ||
  typeof value === 'number'
    ? String(value)
    : null
)

export default class Validator {
  static validateParams = (params: any) => {
    const properties = ['artistSlug', 'albumSlug']

    if (typeof params !== 'object')
      throw new Error(messages.STANDARD_ERROR)

    for (let property of properties)
      if (!Utils.hasOwnProp(params, property))
        throw new Error(messages.STANDARD_ERROR)

    if (
      typeof params.artistSlug !== 'string' ||
      typeof params.albumSlug !== 'string'
    ) throw new Error(messages.STANDARD_ERROR)

    if (params.artistSlug.length === 0 || params.albumSlug === 0)
      throw new Error(messages.STANDARD_ERROR)
  }

  /**
   * Return a complete options object to simplify future validation checks
   * If `options` is not an object, the returned object prop values will all be
   * null. If `options` is an object, any prop values that are numbers or
   * non-empty strings will be added to the returned object as strings. Empty
   * strings and all other types will be given the value of null.
   */
  static prepareOptions = (options: any): PreparedOptions => {
    const optsIsObj = typeof options === 'object'

    let preparedOptions = {
      artistSlug: optsIsObj ? setValue(options.artistSlug) : null,
      sortBy: optsIsObj ? setValue(options.sortBy) : null,
      decade: optsIsObj ? setValue(options.decade) : null,
      search: optsIsObj ? setValue(options.search) : null,
      page: optsIsObj ? setValue(options.page) : null,
    }

    return preparedOptions
  }

  static validateOptions = (options: PreparedOptions) => {
    if (options.sortBy !== null && !validSortBy.includes(options.sortBy))
      throw new Error(messages.INVALID_OPTIONS)

    if (options.decade !== null && !validDecades.includes(options.decade))
      throw new Error(messages.INVALID_OPTIONS)

    if (options.page !== null && !Utils.isInteger(options.page))
      throw new Error(messages.INVALID_OPTIONS)
  }

  static validateAlbum = (album: any) => {
    const properties = ['name', 'slug', 'year', 'artistId', 'tracks', 'image']
    let errors: ErrorsType = {
      name: null,
      slug: null,
      year: null,
      tracks: [],
      image: null,
    }

    // Album should be an object
    if (typeof album !== 'object')
      throw new Error(messages.STANDARD_ERROR)

    // No properties should be missing
    for (let property of properties)
      if (!Utils.hasOwnProp(album, property))
        throw new Error(messages.STANDARD_ERROR)

    // Ensure correct types
    if (
      typeof album.name !== 'string' ||
      typeof album.slug !== 'string' ||
      typeof album.year !== 'string' ||
      typeof album.artistId !== 'string' ||
      !Array.isArray(album.tracks) ||
      (typeof album.image !== 'string' && album.image !== null)
    ) throw new Error(messages.STANDARD_ERROR)

    // Check name
    if (album.name.length === 0)
      errors.name = messages.REQUIRED
    else if (album.name !== Utils.removeUnnecessaryWhitespace(album.name))
      errors.name = 'Please remove any leading, trailing, or consecutive spaces'
    else if (album.name.length > 500)
      errors.name = 'Must not exceed 500 characters'

    // Check slug
    if (album.slug.length === 0)
      errors.slug = messages.REQUIRED
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(album.slug))
      errors.slug = 'Only lowercase alphanumeric and hyphens allowed. Must not begin or end with a hyphen'
    else if (album.slug.length > 500)
      errors.slug = 'Must not exceed 500 characters'

    // Check year
    if (album.year.length === 0)
      errors.year = messages.REQUIRED
    else if (album.year !== Utils.removeUnnecessaryWhitespace(album.year))
      errors.year = 'Please remove any leading, trailing, or consecutive spaces'
    else if (!Utils.isInteger(album.year, true) || album.year.length !== 4)
      errors.year = 'Must be a valid year in YYYY format'

    // Check artistId
    // User selection from a list we populate, no point giving field error
    if (!Utils.isInteger(album.artistId))
      throw new Error(messages.STANDARD_ERROR)

    // Check tracks
    // User should not be able to submit 0 tracks, no point giving field error
    if (album.tracks.length === 0)
      throw new Error(messages.STANDARD_ERROR)
    // Perhaps a separate field error for tracks would be better here but this
    // error is likely to be rare in normal use so generic will suffice
    else if (album.tracks.length > 500)
      throw new Error(messages.STANDARD_ERROR)
    else {
      // Check each track
      const getTrackErrors = (track: any) => {
        const properties = ['number', 'name', 'lengthSeconds']

        // Track should be an object
        if (typeof track !== 'object')
          throw new Error(messages.STANDARD_ERROR)

        // No properties should be missing
        for (let property of properties)
          if (!Utils.hasOwnProp(track, property))
            throw new Error(messages.STANDARD_ERROR)

        // Ensure correct types
        for (let property of properties)
          if (typeof track[property] !== 'string')
            throw new Error(messages.STANDARD_ERROR)

        // Check number
        // User should not be able to edit number, no point giving field error
        if (
          track.number.length === 0 ||
          !Utils.isInteger(track.number)
        ) throw new Error(messages.STANDARD_ERROR)

        let errors: ErrorsType['tracks'][0] = {
          name: null,
          lengthSeconds: null,
        }

        // Check name
        if (track.name.length === 0)
          errors.name = messages.REQUIRED
        else if (track.name !== Utils.removeUnnecessaryWhitespace(track.name))
          errors.name = 'Please remove any leading, trailing, or consecutive spaces'
        else if (track.name.length > 500)
          errors.name = 'Must not exceed 500 characters'

        // Check lengthSeconds
        if (track.lengthSeconds.length === 0)
          errors.lengthSeconds = messages.REQUIRED
        else if (track.lengthSeconds !== Utils.removeUnnecessaryWhitespace(track.lengthSeconds))
          errors.lengthSeconds = 'Please remove any leading, trailing, or consecutive spaces'
        else if (!Utils.isInteger(track.lengthSeconds, true))
          errors.lengthSeconds = 'Must be a valid number of seconds'
        else if (track.lengthSeconds.length > 5)
          errors.lengthSeconds = 'Must not exceed 5 characters'

        return errors
      }

      for (let i = 0; i < album.tracks.length; i++)
        errors.tracks[i] = getTrackErrors(album.tracks[i])
    }

    // Check image
    if (album.image === null)
      errors.image = 'Please upload an image'
    else if (album.image.length === 0)
      errors.image = messages.REQUIRED
    // User should not be able to edit image name, no point giving field error
    else if (album.image.length > 100)
      throw new Error(messages.STANDARD_ERROR)

    let thereAreErrors = false

    // Check if any errors happened
    for (let key of ['name', 'slug', 'year', 'image'])
      if (errors[key] !== null) thereAreErrors = true

    for (let track of errors.tracks)
      if (track.name !== null || track.lengthSeconds !== null)
        thereAreErrors = true

    if (thereAreErrors) throw errors
  }

  // Client-side validation only. File will be validated server-side as well
  static validateImageClientSide = (file: any) => {
    if (!(file instanceof File))
      throw new Error(messages.STANDARD_ERROR)

    // Check file size
    if (file.size > fileLimits.size)
      throw new Error(messages.INVALID_FILE_SIZE)

    // Check file type
    if (!fileLimits.types.includes(file.type))
      throw new Error(messages.INVALID_FILE_TYPE)
  }

  static validateId = (id: any) => {
    if (typeof id !== 'string') throw new Error(messages.STANDARD_ERROR)
  }

  static validateDeletedTracks = (deletedTracks: any) => {
    if (typeof deletedTracks !== 'undefined') {
      if (!Array.isArray(deletedTracks))
        throw new Error(messages.STANDARD_ERROR)

      for (let item of deletedTracks)
        if (typeof item !== 'string')
          throw new Error(messages.STANDARD_ERROR)
    }
  }
}