import { UPDATE_USER, SessionState, SessionActions } from './types'

const initialState: SessionState = {
  isLoggedIn: false,
  user: {
    username: '',
    avatar: '',
    roles: [],
  },
}

export default (
  state = initialState,
  action: SessionActions,
): SessionState => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user,
        },
      }

    default:
      return state
  }
}