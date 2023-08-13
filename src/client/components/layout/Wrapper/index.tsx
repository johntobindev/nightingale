import React, { Component } from 'react'
import style from './style.scss'
import { PropsFromRedux } from './Connected'

class Wrapper extends Component<PropsFromRedux & { children: any }> {
  componentDidUpdate(prevProps: PropsFromRedux) {
    if (prevProps.locked && !this.props.locked)
      this.unlockWrapper()

    if (!prevProps.locked && this.props.locked)
      this.lockWrapper()
  }

  lockWrapper = () => {
    const wrapperElem = this.refs.wrapper
    if (!(wrapperElem instanceof HTMLElement)) return
    wrapperElem.style.position = 'fixed'
    wrapperElem.style.bottom = '0'
    wrapperElem.scrollTop = this.props.scrollPosition
  }

  unlockWrapper = () => {
    const wrapperElem = this.refs.wrapper
    if (!(wrapperElem instanceof HTMLElement)) return
    wrapperElem.style.position = 'absolute'
    wrapperElem.style.bottom = 'auto'

    if (document.documentElement == null || document.body == null)
      return

    document.documentElement.scrollTop = document.body.scrollTop = this.props.scrollPosition
  }

  render() {
    const { children } = this.props

    return (
      <div ref={'wrapper'} className={style['wrapper']}>
        {children}
      </div>
    )
  }
}

export default Wrapper