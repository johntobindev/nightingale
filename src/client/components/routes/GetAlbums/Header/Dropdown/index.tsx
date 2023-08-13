import React, { Component } from 'react'
import style from './style.scss'
import onClickOutside from 'react-onclickoutside'
import { Link } from 'react-router-dom'
import { createUrl } from '../../../../../../api/Albums/Validator'
import QueryString from 'qs'

interface Props {
  active: boolean,
  name: string,
  toggle: () => void,
  hide: () => void,
  children: React.ReactNode,
}

class Dropdown extends Component<Props> {
  handleClickOutside = () => this.props.hide()

  render() {
    const { active, name, toggle, children } = this.props

    return (
      <div className={style['options-item']}>
        <button className={style['button']} onClick={() => toggle()}>
          {name} <i className={'material-icons-round'}>{active ? 'expand_less' : 'expand_more'}</i>
        </button>
        {active && (
          <ol className={style['dropdown']}>{children}</ol>
        )}
      </div>
    )
  }
}

export default onClickOutside(Dropdown)

export const DropdownLink = (props: {
  name: string,
  value?: string,
  pathname: string, 
  queryOptions: QueryString.ParsedQs,
  disabled: boolean,
  children: string,
}) => (
  <Link
    to={createUrl(props.pathname, { ...props.queryOptions, [props.name]: props.value })}
    className={
      props.disabled 
        ? style['is-disabled'] 
        : props.queryOptions[props.name] === props.value 
          ? style['is-active'] 
          : ''
    }
  >
    {props.children}
  </Link>
)