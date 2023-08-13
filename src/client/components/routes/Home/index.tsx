import React from 'react'
import style from './style.scss'
import PageTitle from '../../common/PageTitle'
import GetAlbums from '../GetAlbums/Connected'

const Home = () => (
  <div className={style['container']}>
    <PageTitle title={'Home'}/>

    <GetAlbums/>
  </div>
)

export default Home