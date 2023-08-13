import Users from '../../api/Users'
import Utils from '../routes/Utils'
import GlobalUtils from '../../global/Utils'
import { Request as Req, Response as Res, NextFunction as Next } from 'express'
import { User } from '../../client/state/session/types'

export default async (req: Req, res: Res, next: Next) => {
  // Skip if not logged in
  if (!req.isAuthenticated())
    return next()

  const userId = req.user.user_id
  let user: User

  // If appUser already set on req.user, get it from there
  if (GlobalUtils.hasOwnProp(req.user, 'appUser')) user = { ...req.user.appUser }
  // If appUser not set on req.user, get from database and set it
  else try {
    const exists = await Users.userExists(userId)
    // Add user if doesn't exist (first time login)
    if (!exists) await Users.addUser(userId)
    user = await Users.getUser(userId)
    req.session.passport.user.appUser = user
  } catch (error) {
    console.log(error)
    return next()
  }

  const session = {
    isLoggedIn: true,
    user,
  }

  Utils.mergeToPreloadedState(req, { session })

  next()
}