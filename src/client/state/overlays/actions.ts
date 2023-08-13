import {
  MOUNT,
  ENTER,
  EXIT,
  UNMOUNT,
  MetaName,
  OverlaysActions,
  ScrollPosition,
} from './types'
import {
  lockWrapper,
  unlockWrapper,
} from '../wrapper/actions'
import { AppThunk } from '../types'

const mount = (overlayName: MetaName): OverlaysActions => ({
  type: MOUNT,
  meta: { name: overlayName },
})

const enter = (overlayName: MetaName): OverlaysActions => ({
  type: ENTER,
  meta: { name: overlayName },
})

const exit = (
  scrollPosition: ScrollPosition,
  overlayName: MetaName,
): OverlaysActions => ({
  type: EXIT,
  payload: { scrollPosition },
  meta: { name: overlayName },
})

const unmount = (overlayName: MetaName): OverlaysActions => ({
  type: UNMOUNT,
  meta: { name: overlayName },
})

let timeouts: {
  enter?: number,
  exit?: number,
} = {
  enter: undefined,
  exit: undefined,
}

const showOverlay = (overlayName: MetaName) => (): AppThunk => dispatch => {
  if (timeouts.exit != null)
    window.clearTimeout(timeouts.exit)

  let scrollPosition = 0
  if (document.documentElement != null)
    scrollPosition = document.documentElement.scrollTop
  else if (document.body != null)
    scrollPosition = document.body.scrollTop

  dispatch(lockWrapper(scrollPosition))
  dispatch(mount(overlayName))

  timeouts.enter = window.setTimeout(() => {
    dispatch(enter(overlayName))
  }, 20)
}

const hideOverlay = (overlayName: MetaName) => (): AppThunk => dispatch => {
  if (timeouts.enter != null)
    window.clearTimeout(timeouts.enter)

  let scrollPosition = 0
  if (document.documentElement != null)
    scrollPosition = document.documentElement.scrollTop
  else if (document.body != null)
    scrollPosition = document.body.scrollTop

  dispatch(exit(scrollPosition, overlayName))
  dispatch(unlockWrapper())

  timeouts.exit = window.setTimeout(() => {
    dispatch(unmount(overlayName))
  }, 250)
}

export const showMenuOverlay = showOverlay('menuOverlay')
export const hideMenuOverlay = hideOverlay('menuOverlay')