import {
  INIT_REQUEST,
  INIT_SUCCESS,
  INIT_FAILURE,
  SUBMIT_REQUEST,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE,
  SET_VALUE,
  SET_VALUES,
  UserSettingsActions,
  UserSettingsState,
  Name,
  Value,
} from './types'
import Utils from '../Utils'
import { updateUser } from '../session/actions'
import { AppThunk } from '../types'
import Validator from '../../../api/Users/Validator'

const initRequest = (): UserSettingsActions => ({ type: INIT_REQUEST })

const initSuccess = (
  values: UserSettingsState['values'],
): UserSettingsActions => ({
  type: INIT_SUCCESS,
  payload: { values },
})

const initFailure = (error: Error): UserSettingsActions => ({
  type: INIT_FAILURE,
  payload: { error },
})

const submitRequest = (): UserSettingsActions => ({ type: SUBMIT_REQUEST })

const submitSuccess = (
  values: UserSettingsState['values'],
): UserSettingsActions => ({
  type: SUBMIT_SUCCESS,
  payload: { values },
})

const submitFailure = (
  error: Error | UserSettingsState['errors'],
): UserSettingsActions => ({
  type: SUBMIT_FAILURE,
  payload: { error },
})

export const setValue = (
  name: Name,
  value: Value,
): UserSettingsActions => ({
  type: SET_VALUE,
  payload: { name, value },
})

const setValues = (
  values: UserSettingsState['values'],
): UserSettingsActions => ({
  type: SET_VALUES,
  payload: { values },
})

export const initialiseUserSettings = (): AppThunk => async dispatch => {
  dispatch(initRequest())

  try {
    const values = await Utils.request('/user/settings/get')
    dispatch(initSuccess(values))
  } catch (error) {
    dispatch(initFailure(error))
  }
}

export const submitUserSettings = (): AppThunk => async (dispatch, getState) => {
  dispatch(submitRequest())

  const { values } = getState().userSettings

  try {
    Validator.validateSettings(values)
    const user = await Utils.request('/user/settings/update', values)
    dispatch(updateUser(user))
    dispatch(submitSuccess(values))
  } catch (error) {
    dispatch(submitFailure(error))
  }
}

export const undoChanges = (): AppThunk => (dispatch, getState) => {
  const { applied } = getState().userSettings
  dispatch(setValues(applied))
}