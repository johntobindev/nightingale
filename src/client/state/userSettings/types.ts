export const INIT_REQUEST = 'userSettings/INIT_REQUEST'
export const INIT_SUCCESS = 'userSettings/INIT_SUCCESS'
export const INIT_FAILURE = 'userSettings/INIT_FAILURE'

export const SUBMIT_REQUEST = 'userSettings/SUBMIT_REQUEST'
export const SUBMIT_SUCCESS = 'userSettings/SUBMIT_SUCCESS'
export const SUBMIT_FAILURE = 'userSettings/SUBMIT_FAILURE'

export const SET_VALUE = 'userSettings/SET_VALUE'
export const SET_VALUES = 'userSettings/SET_VALUES'

export type Name = 'username' | 'avatar'
export type Value = string

export function isName(value: any): value is Name {
  return value === 'username' || value === 'avatar'
}

export interface UserSettingsState {
  initialised: boolean,
  loading: boolean,
  error: string | null,
  success: boolean,
  values: Record<Name, Value>,
  applied: Record<Name, Value>,
  errors: Record<Name, string | null>,
}

interface InitRequestAction {
  type: typeof INIT_REQUEST,
}

interface InitSuccessAction {
  type: typeof INIT_SUCCESS,
  payload: { values: UserSettingsState['values'] }
}

interface InitFailureAction {
  type: typeof INIT_FAILURE,
  payload: { error: Error }
}

interface SubmitRequestAction {
  type: typeof SUBMIT_REQUEST,
}

interface SubmitSuccessAction {
  type: typeof SUBMIT_SUCCESS,
  payload: { values: UserSettingsState['values'] },
}

interface SubmitFailureAction {
  type: typeof SUBMIT_FAILURE,
  payload: { error: Error | UserSettingsState['errors'] },
}

interface SetValueAction {
  type: typeof SET_VALUE,
  payload: {  
    name: Name,
    value: Value,
  }
}

interface SetValuesAction {
  type: typeof SET_VALUES,
  payload: { values: UserSettingsState['values'] }
}

export type UserSettingsActions =
  | InitRequestAction
  | InitSuccessAction
  | InitFailureAction
  | SubmitRequestAction
  | SubmitSuccessAction
  | SubmitFailureAction
  | SetValueAction
  | SetValuesAction