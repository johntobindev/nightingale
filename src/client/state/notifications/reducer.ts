import { 
  NotificationType,
  NotificationsActions,
  ADD_NOTIFICATION,
  DELETE_NOTIFICATION,
} from './types'

const initialState: NotificationType[] = []

export default (
  state = initialState, 
  action: NotificationsActions,
): NotificationType[]  => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [
        ...state,
        action.payload,
      ]

    case DELETE_NOTIFICATION: {
      const { index } = action.meta
      let copy = [...state]
      copy[index] = null
      return copy
    }

    default:
      return state
  }
}