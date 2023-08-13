import React, { Component } from 'react'
import style from './style.scss'
import { PropsFromRedux } from './Connected'

type Props = {} & PropsFromRedux

type HandleDelete = (index: number) => void

class Notifications extends Component<Props> {
  handleDelete: HandleDelete = index => this.props.deleteNotification(index)

  render() {
    const { notifications } = this.props

    return (
      <div className={style['notifications']}>
        {notifications.map((item, index) => item !== null && (
          <Notification
            key={index}
            isError={item.isError}
            message={item.message}
            index={index}
            handleDelete={this.handleDelete}
          />
        ))}
      </div>
    )
  }
}

interface NotificationProps {
  isError: boolean,
  message: string,
  index: number,
  handleDelete: HandleDelete,
}

interface NotificationState {
  timerId: number,
}

class Notification extends Component<NotificationProps, NotificationState> {
  state = {
    timerId: 0,
  }

  componentDidMount() {
    this.startTimer()
  }

  clearTimer = () => window.clearTimeout(this.state.timerId)

  startTimer = () => {
    const { handleDelete, index } = this.props

    this.setState({
      timerId: window.setTimeout(() => handleDelete(index), 5000),
    })
  }

  render() {
    const { isError, message, index, handleDelete } = this.props

    return (
      <div
        className={style['notification'] + ' ' + (isError ? style['is-error'] : style['is-success'])}
        onMouseEnter={this.clearTimer}
        onMouseLeave={this.startTimer}
      >
        <div className={style['icon']}>
          {isError && <i className={'fas fa-exclamation'}></i> || <i className={'fas fa-check'}></i>}
        </div>

        <div className={style['text']}>{message}</div>

        <button className={style['close']} onClick={e => {
          e.preventDefault()
          handleDelete(index)
        }}>
          <i className={'fas fa-times'}></i>
        </button>
      </div>
    )
  }
}

export default Notifications