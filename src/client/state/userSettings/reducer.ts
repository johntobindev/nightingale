import { 
  INIT_REQUEST,
  INIT_SUCCESS,
  INIT_FAILURE,
  SUBMIT_REQUEST,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE,
  SET_VALUE,
  SET_VALUES,
  UserSettingsState,
  UserSettingsActions,
} from './types'
import { combineReducers } from 'redux'
import Utils from '../Utils'

const initialState: UserSettingsState = {
  initialised: false,
  loading: false,
  error: null,
  success: false,
  values: {
    username: '',
    avatar: '',
  },
  applied: {
    username: '',
    avatar: '',
  },
  errors: {
    username: null,
    avatar: null,
  },
}

const initialised = (
  state = initialState.initialised, 
  action: UserSettingsActions,
): UserSettingsState['initialised'] => {
  switch (action.type) {
    case INIT_SUCCESS:
      return true

    case INIT_REQUEST: 
      return false

    default:
      return state
  }
}

const loading = (
  state = initialState.loading, 
  action: UserSettingsActions,
): UserSettingsState['loading'] => {
  switch (action.type) {
    case INIT_REQUEST:
    case SUBMIT_REQUEST:
      return true

    case INIT_SUCCESS:
    case INIT_FAILURE:
    case SUBMIT_SUCCESS:
    case SUBMIT_FAILURE:
      return false

    default:
      return state
  }
}

const error = (
  state = initialState.error, 
  action: UserSettingsActions,
): UserSettingsState['error'] => {
  switch (action.type) {    
    case INIT_REQUEST:
    case INIT_SUCCESS:
    case SUBMIT_REQUEST:
    case SUBMIT_SUCCESS:
      return null

    case INIT_FAILURE:
    case SUBMIT_FAILURE:
      if (action.payload.error instanceof Error)
        return action.payload.error.message

      return null

    default:
      return state
  }
}

const success = (
  state = initialState.success, 
  action: UserSettingsActions,
): UserSettingsState['success'] => {
  switch (action.type) {
    case SUBMIT_SUCCESS:
      return true

    case SUBMIT_REQUEST:
    case INIT_REQUEST:
      return false

    default:
      return state
  }
}

const values = (
  state = initialState.values, 
  action: UserSettingsActions,
): UserSettingsState['values'] => {
  switch (action.type) {
    case SET_VALUE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      }

    case SET_VALUES:
    case INIT_SUCCESS:
      return Utils.createValuesObject(action.payload.values)

    default:
      return state
  }
}

const applied = (
  state = initialState.applied, 
  action: UserSettingsActions,
): UserSettingsState['applied'] => {
  switch (action.type) {
    case INIT_SUCCESS:
    case SUBMIT_SUCCESS:
      return Utils.createValuesObject(action.payload.values)

    default:
      return state
  }
}

const errors = (
  state = initialState.errors, 
  action: UserSettingsActions,
): UserSettingsState['errors'] => {
  switch (action.type) {
    case SUBMIT_FAILURE:
      if (action.payload.error instanceof Error)
        return initialState.errors
      
      return {
        ...state,
        ...action.payload.error,
      }

    case SUBMIT_REQUEST:
      return initialState.errors

    default:
      return state
  }
}

export default combineReducers({
  initialised,
  loading, 
  error,
  success,
  values,
  applied,
  errors,
})