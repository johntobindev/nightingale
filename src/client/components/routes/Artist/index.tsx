import React from 'react'
import style from './style.scss'
import { withRouter, Switch, Route, RouteComponentProps } from 'react-router-dom'
import GetAlbums from '../GetAlbums/Connected'
import Header from './Header/Connected'
import Album from './Album/Connected'
import { PropsFromRedux } from './Connected'

const Artist = (props: PropsFromRedux & RouteComponentProps) => (
  <div className={style['container']}>
    <Header/>

    <Switch>
      {props.artistError === null && (
        <Route
          path={'/:artist'}
          exact={true}
          render={() => <GetAlbums/>}
        />
      )}

      <Route
        path={'/:artist/:album'}
        exact={true}
        render={() => <Album/>}
      />
    </Switch>
  </div>
)

export default withRouter(Artist)