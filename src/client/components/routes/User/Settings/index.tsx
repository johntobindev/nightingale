import React, { Component } from 'react'
import style from './style.scss'
import Avatars from '../../../../../api/Avatars'
import Utils from '../../../../../global/Utils'
import { PropsFromRedux } from './Connected'
import { isName } from '../../../../state/userSettings/types'

class UserSettings extends Component<PropsFromRedux> {
  componentDidMount() {
    this.props.initialiseUserSettings()
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!isName(e.currentTarget.name)) return
    this.props.setValue(e.currentTarget.name, e.currentTarget.value)
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.submitUserSettings()
  }

  handleUndo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.undoChanges()
  }

  setAvatar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.setValue('avatar', e.currentTarget.value)
  }

  render() {
    const { initialised, loading, error, success, values, errors, noChanges } = this.props
    const disabled = !initialised || loading

    return (
      <form className={style['form']} onSubmit={this.handleSubmit}>
        <label htmlFor={'username'}>Username</label>
        <input id={'username'} name={'username'} value={values.username} disabled={disabled} onChange={this.handleChange}/>
        {errors.username !== null && <p>{errors.username}</p>}

        <div className={style['avatars']}>
          {Avatars.avatars.map((avatar, index) => (
            <button key={index} onClick={this.setAvatar} value={avatar} className={
              Utils.getStyleName(style, 'avatar', values.avatar === avatar, 'is-selected')
            } style={{
              backgroundImage: `url('/static/images/avatars/${avatar}.png')`,
            }}><div></div>
            </button>
          ))}
        </div>
        {errors.avatar !== null && <p>{errors.avatar}</p>}
        
        <button 
          type={'submit'} 
          className={style['button'] + ' ' + style['button--submit']} 
          disabled={disabled || noChanges}
        >Save</button>

        <button 
          className={style['button'] + ' ' + style['button--undo']} 
          disabled={disabled || noChanges}
          onClick={this.handleUndo}
        >Undo changes</button>

        {error !== null && <p>{error}</p>}

        {success && <p>Done!</p>}
      </form>
    )
  }
}

export default UserSettings