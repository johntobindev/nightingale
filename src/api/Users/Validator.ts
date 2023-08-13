import messages from '../../global/messages'
import Utils from '../../global/Utils'
import Avatars from '../Avatars'

export default class Validator {
  static validateSettings = (settings: any) => {
    const properties = ['username', 'avatar']

    let errors: {
      username: string | null,
      avatar: string | null,
    } = {
      username: null,
      avatar: null,
    }

    // Settings should be an object
    if (typeof settings !== 'object')
      throw new Error(messages.STANDARD_ERROR)

    // No properties should be missing
    for (let property of properties)
      if (!Utils.hasOwnProp(settings, property))
        throw new Error(messages.STANDARD_ERROR)

    // Ensure correct types
    if (
      typeof settings.username !== 'string' ||
      typeof settings.avatar !== 'string'
    ) throw new Error(messages.STANDARD_ERROR)

    // Check username
    if (settings.username.length === 0)
      errors.username = messages.REQUIRED
    else if (settings.username !== Utils.removeUnnecessaryWhitespace(settings.username))
      errors.username = 'Please remove any leading, trailing, or consecutive spaces'
    else if (settings.username.length < 3) 
      errors.username = 'Minimum 3 characters'
    else if (settings.username.length > 12) 
      errors.username = 'Maximum 12 characters'
    else if (/\W/.test(settings.username))
      errors.username = 'Username may only contain letters, numbers, and underscores'

    // Check avatar
    if (!Avatars.avatarExists(settings.avatar))
      errors.avatar = messages.INVALID

    // Check if any errors happened
    let thereAreErrors: boolean = false
    for (let key of properties)
      if (errors[key] !== null) thereAreErrors = true

    if (thereAreErrors) throw errors
  }
}