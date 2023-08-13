import Auth0Strategy from 'passport-auth0'
import auth0Conf from './credentials/auth0.config'
import { PassportStatic } from 'passport'

const strategy = new Auth0Strategy({
  callbackURL: auth0Conf.CALLBACK_URL,
  clientID: auth0Conf.CLIENT_ID,
  clientSecret: auth0Conf.CLIENT_SECRET,
  domain: auth0Conf.DOMAIN,
}, (accessToken, refreshToken, extraParams, profile, done) => {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile)
})

export default (passport: PassportStatic) => {
  passport.use(strategy)

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}