import React from 'react'
import style from './style.scss'
import { Switch, Route, NavLink, LinkProps } from 'react-router-dom'
import Album from './Album/Connected'
import Artist from './Artist/Connected'

const CommonLink = (props: {
  to: LinkProps['to'],
  children: string,
}) => (
  <NavLink
    to={props.to}
    className={style['link']}
    activeClassName={style['is-active']}
  >{props.children}</NavLink>
)

const Admin = () => {
  return (
    <Switch>
      <Route path={'/admin/(add-album|add-artist)'} render={() => (
        <div className={style['container']}>
          <div className={style['links']}>
            <CommonLink to={'/admin/add-album'}>Add album</CommonLink>
            <CommonLink to={'/admin/add-artist'}>Add artist</CommonLink>
          </div>
    
          <Switch>
            <Route path={'/admin/add-album'} render={() => <Album/>}/>
            <Route path={'/admin/add-artist'} render={() => <Artist/>}/>
          </Switch>
        </div>
      )}/>

      <Route path={'/admin/edit-album/:id'} render={() => (
        <div className={style['container']}>
          <div className={style['links']}>
            <CommonLink to={'/admin/edit-album'}>Edit album</CommonLink>
          </div>

          <Album isUpdate={true}/>
        </div>
      )}/>

      <Route path={'/admin/edit-artist/:id'} render={() => (
        <div className={style['container']}>
          <div className={style['links']}>
            <CommonLink to={'/admin/edit-artist'}>Edit artist</CommonLink>
          </div>

          <Artist isUpdate={true}/>
        </div>
      )}/>
    </Switch>
  )
}

export default Admin