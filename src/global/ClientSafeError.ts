/**
 * A faux-error object to be thrown as exception with a client-safe message
 * By using instanceof ClientSafeError, we can safely throw an error mesasge
 * that will be readable by the client, or alternatively throw a standard
 * error message, keeping secure information private
 */
class ClientSafeError extends Error {
  message: string

  constructor(message: string) {
    super(message)
  }
}

export default ClientSafeError