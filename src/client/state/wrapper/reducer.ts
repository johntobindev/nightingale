import {
  WrapperState,
  LOCK_WRAPPER,
  UNLOCK_WRAPPER,
  WrapperActions,
} from './types'

const initialState: WrapperState = {
  locked: false,
  scrollPosition: 0,
}

export default (
  state = initialState,
  action: WrapperActions,
): WrapperState => {
  switch (action.type) {
    case LOCK_WRAPPER:
      return {
        ...state,
        locked: true,
        scrollPosition: action.payload.scrollPosition,
      }

    case UNLOCK_WRAPPER:
      return {
        ...state,
        locked: false,
      }

    default: return state
  }
}