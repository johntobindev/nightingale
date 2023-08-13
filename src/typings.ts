declare module '*.scss' {
  const styles: { [className: string]: string }
  export default styles
}

declare namespace Express {
  export interface Request {
    preloadedState: Record<string, any>,
  }

  export interface User {
    appUser: import('./client/state/session/types').User,
    user_id: string,
  }
}