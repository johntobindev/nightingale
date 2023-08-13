import { Role } from '../../../global/Auth'

export const UPDATE_USER = 'session/UPDATE_USER'

export interface User {
  username: string,
  avatar: string,
  roles: Role[],
}

export interface SessionState {
  isLoggedIn: boolean,
  user: User,
}

interface UpdateUserAction {
  type: typeof UPDATE_USER,
  payload: { user: {} }
}

export type SessionActions = UpdateUserAction