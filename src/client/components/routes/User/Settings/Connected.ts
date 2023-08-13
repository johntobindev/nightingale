import { connect, ConnectedProps } from 'react-redux'
import UserSettings from './index'
import { 
  setValue, 
  undoChanges,
  initialiseUserSettings, 
  submitUserSettings,
} from '../../../../state/userSettings/actions'
import { noChanges } from '../../../../state/userSettings/selectors'
import { RootState } from '../../../../state'

const mapState = (state: RootState) => ({ 
  ...state.userSettings, 
  noChanges: noChanges(state),
})

const mapDispatch = {
  setValue,
  undoChanges,
  initialiseUserSettings,
  submitUserSettings,
}

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(UserSettings)