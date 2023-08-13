import React, { Component } from 'react'
import style from './style.scss'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { SessionState } from '../../../state/session/types'
import { createUrl, getQueryOptions } from '../../../../api/Albums/Validator'

type Props = {
  session: SessionState,
} & RouteComponentProps

interface State {
  searchText: string,
}

class Header extends Component<Props, State> {
  state = {
    searchText: '',
  }

  inputRef = React.createRef<HTMLInputElement>()

  handleChange: React.FormEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    this.setState({ searchText: e.currentTarget.value })
  }

  handleDelete: React.FormEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    this.setState({ searchText: '' })
    if (this.inputRef.current !== null)
      this.inputRef.current.focus()
  }

  handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const queryOptions = getQueryOptions(this.props.location.search)

    const url = createUrl('/', {
      ...queryOptions,
      'sortBy': this.state.searchText.length > 0 ? undefined : queryOptions['sortBy'],
      search: this.state.searchText.length > 0 ? this.state.searchText : undefined,
    })

    this.props.history.push(url)
  }

  render() {
    const { session } = this.props

    return (
      <header className={style['header']}>
        <Link to={'/'} className={style['logo']}>Albums</Link>

        <form className={style['search']} onSubmit={this.handleSubmit}>
          <input
            type={'text'}
            placeholder={'Search albums, artists, or songs'}
            value={this.state.searchText}
            onChange={this.handleChange}
            ref={this.inputRef}
          />

          <button type={'button'} onClick={this.handleDelete}>
            <i className={'fas fa-backspace'}></i>
          </button>

          <button><i className={'fas fa-search'}></i></button>
        </form>

        <Link to={'/admin/add-album'} className={style['add-album']}>
          Add album
        </Link>

        {!session.isLoggedIn && (
          <a className={style['log-in']}>Log in</a>
        )}

        {session.isLoggedIn && (
          <a href='/logout' className={style['log-in']}>Log out</a>
        )}
      </header>
    )
  }
}

export default withRouter(Header)