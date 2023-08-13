import { 
  ADD_NOTIFICATION, 
  NotificationsActions,
  DELETE_NOTIFICATION,
} from './types'

export const addNotification = (
  message: string,
  isError: boolean = false,
): NotificationsActions => ({
  type: ADD_NOTIFICATION,
  payload: { message, isError },
})

export const deleteNotification = (
  index: number,
): NotificationsActions => ({
  type: DELETE_NOTIFICATION,
  meta: { index },
})