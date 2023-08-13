import {
  LOCK_WRAPPER,
  UNLOCK_WRAPPER,
  ScrollPosition,
  WrapperActions,
} from './types'

export const lockWrapper = (
  scrollPosition: ScrollPosition,
): WrapperActions => ({
  type: LOCK_WRAPPER,
  payload: { scrollPosition },
})

export const unlockWrapper = (): WrapperActions => ({
  type: UNLOCK_WRAPPER,
})