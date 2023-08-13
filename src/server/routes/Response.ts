/**
 * Standard response object for requests
 */
class Response {
  error: boolean
  payload: any
  meta: {}

  constructor(
    error = false,
    payload: any = null,
    meta = {},
  ) {
    this.error = error
    this.payload = payload
    this.meta = {
      ...meta,
      timestamp: new Date().getTime(),
    }
  }
}

export default Response