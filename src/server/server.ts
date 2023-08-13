const env = process.env.NODE_ENV || 'production'

import headers from './middleware/headers'
import preloadedState from './middleware/preloadedState'
import preloadSession from './middleware/preloadSession'
import redisClient from './databases/redisClient'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import csrf from 'csurf'
import path from 'path'
import hmrConfig from './hmr.config'
import passportConfig from './passport.config'
import helmetConfig from './helmet.config'
import routes from './routes'
import { randomUUID } from 'crypto'
import credentials from './credentials/session'

const RedisStore = connectRedis(session)

const app = express()

// Enable hmr in development environment
if (env === 'development') hmrConfig(app)

app.use((req, res, next) => {
  res.locals.nonce = randomUUID()

  const cspMiddleware = helmet(helmetConfig(res.locals.nonce))

  cspMiddleware(req, res, next)
})

app.use('/static', express.static(path.resolve(__dirname + './../../static')))

app.use(headers())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  cookie: { sameSite: 'lax' },
  resave: false,
  saveUninitialized: true,
  secret: credentials.secret,
  store: new RedisStore({ client: redisClient }),
}))
app.use(csrf())

app.use(passport.initialize())
app.use(passport.session())

passportConfig(passport)

app.use(preloadedState)
app.use(preloadSession)

routes(app, passport)

const port = 3002
app.listen(port, () => console.log(`listening on ${port}`))