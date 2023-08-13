import { createSelector } from 'reselect'
import Utils from '../../../global/Utils'
import { RootState } from '../index'

const valuesSelector = (state: RootState) => state.userSettings.values
const appliedSelector = (state: RootState) => state.userSettings.applied

export const noChanges = createSelector(
  valuesSelector,
  appliedSelector,
  (values, applied) => Utils.sharedPropertiesEqual(values, applied),
)