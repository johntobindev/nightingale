import { UPDATE_USER, SessionActions, User } from './types'

export const updateUser = (user: User): SessionActions => ({
  type: UPDATE_USER,
  payload: { user },
})