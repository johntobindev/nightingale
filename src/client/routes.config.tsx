import Home from './components/routes/Home'
import Secret from './components/routes/Secret'
import OverlayTest from './components/routes/OverlayTest/Connected'
import UserSettings from './components/routes/User/Settings/Connected'
import React from 'react'
import ErrorPage from './components/common/ErrorPage'
import Auth, { Role } from '../global/Auth'
import Artist from './components/routes/Artist/Connected'
import Admin from './components/routes/Admin'

const createRouteConfig = (
  path: string | null,
  component: React.FC | any,
  authorisedRoles: Role[] = [],
  exact = true,
) => ({ path, component, authorisedRoles, exact })

export type RouteConfig = ReturnType<typeof createRouteConfig>

export default [
  createRouteConfig('/', Home),

  createRouteConfig('/read-mode-test', Home),

  createRouteConfig('/secret', Secret, [Auth.roles.member]),

  createRouteConfig('/overlay-test', OverlayTest),

  createRouteConfig('/user/settings', UserSettings, [Auth.roles.member]),

  createRouteConfig('/admin/(add-album|add-artist)', Admin),

  createRouteConfig('/admin/(edit-album|edit-artist)/:id', Admin),

  createRouteConfig('/:artist/:album?', Artist),

  createRouteConfig(null, () => <ErrorPage error={'Page not found'}/>, [], false),
]