import React from 'react'
import style from './style.scss'

export const Placeholder = () => (
  <div className={style['placeholder']}></div>
)

const LoadingSpinner = () => (
  <div className={style['loading']}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)

export default LoadingSpinner