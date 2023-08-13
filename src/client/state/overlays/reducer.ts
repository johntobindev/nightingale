import { combineReducers } from 'redux'
import Utils from '../Utils'
import { MOUNT, ENTER, EXIT, UNMOUNT, OverlayState, MetaName, OverlaysActions } from './types'

const initialState: OverlayState = {
  active: false,
  entering: false,
  exiting: false,
  scrollPosition: 0,
}

const reducer = (overlayName: MetaName) => (
  state = initialState, 
  action: OverlaysActions,
): OverlayState => {
  if (!Utils.metaNameCheck(overlayName, action))
    return state

  switch(action.type) {
    case MOUNT:
      return {
        ...state,
        active: true,
      }

    case ENTER:
      return { 
        ...state,
        entering: true,
      }

    case EXIT:
      return { 
        ...state,
        entering: false,
        exiting: true,
        scrollPosition: action.payload.scrollPosition,
      }
    
    case UNMOUNT:
      return { 
        ...state,
        active: false,
        exiting: false,
      }

    default:
      return state
  }
}

export default combineReducers({
  menuOverlay: reducer('menuOverlay'),
})