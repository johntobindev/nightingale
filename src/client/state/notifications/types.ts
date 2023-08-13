export const ADD_NOTIFICATION = 'notifications/ADD_NOTIFICATION'
export const DELETE_NOTIFICATION = 'notifications/DELETE_NOTIFICATION'

export type NotificationType = {
  isError: boolean,
  message: string,
} | null

interface AddNotificationAction {
  type: typeof ADD_NOTIFICATION,
  payload: {
    message: string,
    isError: boolean,
  }
}

interface DeleteNotificationAction {
  type: typeof DELETE_NOTIFICATION,
  meta: { index: number },
}

export type NotificationsActions =
  | AddNotificationAction
  | DeleteNotificationAction