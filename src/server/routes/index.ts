import { Application as App } from 'express'
import { PassportStatic } from 'passport'

import auth from './auth'
import user from './user'

import albums from './albums'
import artists from './artists'
import admin from './admin'

import general from './general'
import matchAll from './matchAll'

export default (app: App, passport: PassportStatic) => {
  auth(app, passport)
  user(app)

  albums(app)
  artists(app)
  admin(app)

  general(app)
  matchAll(app)
}