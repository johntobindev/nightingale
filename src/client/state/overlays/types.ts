export const MOUNT = 'overlays/MOUNT'
export const ENTER = 'overlays/ENTER'
export const EXIT = 'overlays/EXIT'
export const UNMOUNT = 'overlays/UNMOUNT'

export type MetaName = 'menuOverlay'
export type ScrollPosition = number

export interface OverlayState {
  active: boolean,
  entering: boolean,
  exiting: boolean,
  scrollPosition: ScrollPosition,
}

interface MountAction {
  type: typeof MOUNT,
  meta: { name: MetaName },
}

interface EnterAction {
  type: typeof ENTER,
  meta: { name: MetaName },
}

interface ExitAction {
  type: typeof EXIT,
  payload: { scrollPosition: ScrollPosition },
  meta: { name: MetaName },
}

interface UnmountAction {
  type: typeof UNMOUNT,
  meta: { name: MetaName },
}

export type OverlaysActions = 
  | MountAction
  | EnterAction
  | ExitAction
  | UnmountAction