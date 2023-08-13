import React, { Component } from 'react'
import style from './style.scss'
import Utils from '../../../../global/Utils'
import { PropsFromRedux } from './Connected'
import { RouteComponentProps } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

type Props = PropsFromRedux & RouteComponentProps

class Menu extends Component<Props> {
  unlisten = this.props.history.listen(this.props.hideOverlay)

  componentDidMount() {
    this.restoreScrollPosition()
    window.addEventListener('keyup', this.handleKeyup)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup)
    this.unlisten()
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.exiting && this.props.exiting)
      this.lockScrollPosition()
  }

  restoreScrollPosition = () => {
    if (document.documentElement == null) return
    if (document.body == null) return

    document.documentElement.scrollTop
      = document.body.scrollTop
      = this.props.scrollPosition
  }

  lockScrollPosition = () => {
    const containerElem = this.refs.container
    const screenElem = this.refs.screen
    if (!(containerElem instanceof HTMLElement)) return
    if (!(screenElem instanceof HTMLElement)) return

    containerElem.style.position = 'fixed'
    screenElem.style.position = 'fixed'
    containerElem.style.bottom = '0'
    containerElem.scrollTop = this.props.scrollPosition
  }

  handleKeyup = (e: KeyboardEvent) => {
    const { exiting, hideOverlay } = this.props
    if (!exiting && e.keyCode === 27) hideOverlay()
  }

  handleClick = () => {
    const { hideOverlay } = this.props
    hideOverlay()
  }

  render() {
    const { entering, exiting, hideOverlay } = this.props

    let screenStyleName = 'screen'
    if (entering) screenStyleName = Utils.getStyleName(style, 'screen', true, 'is-entering')
    else if (exiting) screenStyleName = Utils.getStyleName(style, 'screen', true, 'is-exiting')

    return (
      <div className={style['container']} ref={'container'}>
        <div className={screenStyleName} onClick={this.handleClick} ref={'screen'}></div>

        <div className={style['overlay-wrapper']}>
          <div className={Utils.getStyleName(style, 'overlay', entering, 'is-entering')}>
            {/* START CONTENT */}
            <button onClick={hideOverlay} className={style['close-button']} aria-label={'Close menu'}>
              <i className={'material-icons-round'}>close</i>
            </button>

            <nav className={style['content']}>
              <NavLink exact to={'/'}>News</NavLink>
              <NavLink exact to={'/'}>Reviews</NavLink>
              <NavLink exact to={'/'}>Features</NavLink>
              <NavLink exact to={'/'}>Podcast</NavLink>
            </nav>
            {/* END CONTENT */}
          </div>
        </div>
      </div>
    )
  }
}

export default Menu