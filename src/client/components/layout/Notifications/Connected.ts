import { connect, ConnectedProps } from 'react-redux'
import Notifications from './index'
import { deleteNotification } from '../../../state/notifications/actions'
import { RootState } from '../../../state'

const mapState = (state: RootState) => ({ notifications: state.notifications })
const mapDispatch = { deleteNotification }

const connector = connect(mapState, mapDispatch)
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Notifications)