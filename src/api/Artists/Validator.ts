import messages from '../../global/messages'
import Utils from '../../global/Utils'
import { ErrorsType } from '../../client/state/adminArtist/types'

export interface ValidArtist {
  name: string,
  slug: string,
  image: string,
}

export default class Validator {
  static validateParams = (params: any) => {
    const properties = ['artistSlug']

    if (typeof params !== 'object')
      throw new Error(messages.STANDARD_ERROR)

    for (let property of properties)
      if (!Utils.hasOwnProp(params, property)) 
        throw new Error(messages.STANDARD_ERROR)

    if (typeof params.artistSlug !== 'string') 
      throw new Error(messages.STANDARD_ERROR)

    if (params.artistSlug.length === 0)
      throw new Error(messages.STANDARD_ERROR)
  }

  static validateArtist = (artist: any) => {
    const properties = ['name', 'slug', 'image']
    let errors: ErrorsType = {
      name: null,
      slug: null,
      image: null,
    }

    // Album should be an object
    if (typeof artist !== 'object')
      throw new Error(messages.STANDARD_ERROR)

    // No properties should be missing
    for (let property of properties)
      if (!Utils.hasOwnProp(artist, property)) 
        throw new Error(messages.STANDARD_ERROR)

    // Ensure correct types
    if (
      typeof artist.name !== 'string' ||
      typeof artist.slug !== 'string' ||
      (typeof artist.image !== 'string' && artist.image !== null)
    ) throw new Error(messages.STANDARD_ERROR)

    // Check name
    if (artist.name.length === 0)
      errors.name = messages.REQUIRED
    else if (artist.name !== Utils.removeUnnecessaryWhitespace(artist.name))
      errors.name = 'Please remove any leading, trailing, or consecutive spaces'
    else if (artist.name.length > 500) 
      errors.name = 'Must not exceed 500 characters'

    // Check slug
    if (artist.slug.length === 0) 
      errors.slug = messages.REQUIRED
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(artist.slug)) 
      errors.slug = 'Only lowercase alphanumeric and hyphens allowed. Must not begin or end with a hyphen'
    else if (artist.slug.length > 500) 
      errors.slug = 'Must not exceed 500 characters'

    // Check image
    if (artist.image === null)
      errors.image = 'Please upload an image'
    else if (artist.image.length === 0) 
      errors.image = messages.REQUIRED
    // User should not be able to edit image name, no point giving field error
    else if (artist.image.length > 100)
      throw new Error(messages.STANDARD_ERROR)

    let thereAreErrors = false

    // Check if any errors happened
    for (let key of ['name', 'slug', 'image'])
      if (errors[key] !== null) thereAreErrors = true

    if (thereAreErrors) throw errors
  }

  static validateId = (id: any) => {
    if (typeof id !== 'string') throw new Error(messages.STANDARD_ERROR)
  }
}