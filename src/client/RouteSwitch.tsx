import React from 'react'
import { Switch, Route } from 'react-router-dom'
import routesConfig, { RouteConfig } from './routes.config'
import Auth from '../global/Auth'
import Content from './components/layout/Content'
import ErrorPage from './components/common/ErrorPage'
import messages from '../global/messages'
import { SessionState } from './state/session/types'

const Unauthorised = ({ isLoggedIn = false }) => (
  isLoggedIn
    ? <ErrorPage error={messages.UNAUTHORISED_LOGGED_IN}/>
    : <ErrorPage error={messages.UNAUTHORISED_NOT_LOGGED_IN}/>
)

const mapRoutes = (routesConfig: RouteConfig[], session: SessionState) => (
  routesConfig.map((config, index) => (
    <Route
      key={index}
      path={config.path || ''}
      exact={config.exact || false}
      render={() => {
        if (config.authorisedRoles.length) {
          if (!session.isLoggedIn)
            return <Content><Unauthorised/></Content>

          if (!Auth.isAuthorised(session.user.roles, config.authorisedRoles))
            return <Content><Unauthorised isLoggedIn={true}/></Content>
        }

        return (
          <Content>
            <config.component/>
          </Content>
        )}
      }
    />
  ))
)

interface Props {
  session: SessionState,
}

const RouteSwitch = (props: Props) => (
  <Switch>
    {mapRoutes(routesConfig, props.session)}
  </Switch>
)

export default RouteSwitch