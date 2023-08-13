import React from 'react'
import style from './style.scss'

interface Props {
  children: React.ReactNode,
}

const Content = (props: Props) => (
  <div className={style.content}>{props.children}</div>
)

export default Content