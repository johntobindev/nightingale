import { AuthenticateOptions } from 'passport'

declare module 'passport' {
  interface AuthenticateOptions {
    audience?: string,
    clientID?: string,
    domain?: string,
    redirectUri?: string,
    responseType?: string,
  }
}

declare module 'express-session' {
  interface SessionData {
    passport: { user: {
      appUser: import('./client/state/session/types').User,
      user_id: string,
    } },
  }
}