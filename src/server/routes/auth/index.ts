import Auth from '../../../global/Auth'
import Utils from '../Utils'
import auth0Conf from '../../credentials/auth0.config'
import { Application as App } from 'express'
import { PassportStatic } from 'passport'

export default (app: App, passport: PassportStatic) => {
  app.get('/auth/token', (req, res, next) => {
    if (!req.xhr) return next()

    Utils.handleSuccess(res, req.csrfToken())
  })

  app.get(
    '/callback',
    passport.authenticate('auth0', { failureRedirect: '/login' }),
    (req, res) => {
      if (!req.user)
        throw new Error('user null')

      res.redirect('/')
    },
  )

  app.get(
    '/login',
    passport.authenticate('auth0', {
      audience: auth0Conf.AUDIENCE,
      clientID: auth0Conf.CLIENT_ID,
      domain: auth0Conf.DOMAIN,
      redirectUri: auth0Conf.CALLBACK_URL,
      responseType: 'code',
      scope: 'openid',
    }),
    (req, res) => {
      res.redirect('/')
    },
  )

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.post(
    '/checkParams',
    Utils.requireParams('required'),
    (req, res) => {
      console.log('param present')
      Utils.handleSuccess(res)
    },
  )

  app.post(
    '/checkAuth',
    Utils.authorise([Auth.roles.administrator]),
    (req, res) => {
      console.log('authorised')
      Utils.handleSuccess(res)
    },
  )
}