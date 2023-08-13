import axios, { AxiosRequestConfig } from 'axios'
import qs from 'qs'
import messages from '../../global/messages'
import GlobalUtils from '../../global/Utils'

class Utils {
  /**
   * Get a new csrf token. Token should be retrieved and used for every request
   * that requires a token.
   */

  static getToken = async () => {
    const headers = { 'X-Requested-With': 'XMLHttpRequest' }
    const response = await axios.get('/auth/token', { headers }).catch(() => {
      throw new Error(messages.NETWORK_ERROR)
    })
    const { error, payload } = response.data

    if (error)
      throw Error(payload.error)

    return payload
  }

  /**
   * Endpoint request wrapper, automatically fetches and prepends csrf token
   * and rejects appropriate error type: if error payload is an object, assumes
   * object of multiple key=>error pairs, else assumes payload is error string
   * and wraps in Error.
   */
  /*static request = async (url, data = {}) => {
    const _csrf = await Utils.getToken()
    const dataString = qs.stringify({ _csrf, ...data })
    const response = await axios.post(url, dataString).catch(() => {
      throw new Error(messages.NETWORK_ERROR)
    })
    const { error, payload } = response.data

    if (error) {
      if (typeof payload === 'object') throw payload
      throw new Error(payload)
    }

    return payload
  }*/

  /**
   * Slow version
   */
  static request = (
    url: string,
    data = {},
    multipart: boolean = false,
  ): Promise<any> => new Promise((resolve, reject) => {
    setTimeout(async () => {
      const _csrf = await Utils.getToken()

      if (!multipart) data = qs.stringify(data)

      let config: AxiosRequestConfig = {
        headers: { 'csrf-token': _csrf },
      }

      if (multipart) config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' }

      try {
        const response = await axios.post(url, data, config).catch(() => {
          throw new Error(messages.NETWORK_ERROR)
        })

        const { error, payload } = response.data

        if (error) {
          if (typeof payload === 'object') reject(payload)
          reject(new Error(payload))
        }

        resolve(payload)
      } catch (error) {
        return reject(error)
      }
    }, 0)
  })

  /**
   * For a given metaName and action, fail if metaName does not match action's
   * meta.name. Enabling the bypass will cause the check to succeed where an
   * action has no meta.name property defined.
   */
  static metaNameCheck = (
    name: string,
    action: Record<string, any>,
    bypassIfNoName = false,
  ) => {
    if (bypassIfNoName)
      if (action.meta == null || action.meta.name == null)
        return true

    return action.meta != null && action.meta.name === name
  }

  static createValuesObject = values => {
    let newValues = { ...values }

    for (let name of Object.keys(newValues))
      newValues[name] = GlobalUtils.convertToString(newValues[name])

    return newValues
  }
}

export default Utils