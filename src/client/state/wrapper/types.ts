export const LOCK_WRAPPER = 'wrapper/LOCK_WRAPPER'
export const UNLOCK_WRAPPER = 'wrapper/UNLOCK_WRAPPER'

export type ScrollPosition = number

export interface WrapperState {
  locked: boolean,
  scrollPosition: ScrollPosition,
}

interface LockWrapperAction {
  type: typeof LOCK_WRAPPER,
  payload: { scrollPosition: ScrollPosition }
}

interface UnlockWrapperAction {
  type: typeof UNLOCK_WRAPPER,
}

export type WrapperActions = 
  | LockWrapperAction
  | UnlockWrapperAction