import Response from './Response'
import messages from '../../global/messages'
import Auth, { Role } from '../../global/Auth'
import { Request as Req, Response as Res, NextFunction as Next } from 'express'
import GlobalUtils from '../../global/Utils'

const isAuthorised = (req: Req, authorisedRoles: Role[]) => {
  if (!req.isAuthenticated()) return false
  const userRoles = req.user.appUser.roles
  return Auth.isAuthorised(userRoles, authorisedRoles)
}

const ensureParamsDefined = (req: Req, params: string[]) => {
  if (!GlobalUtils.hasOwnProp(req, 'body'))
    return false

  // added re flow error cannot call hasownproperty missing in mixed
  const body = JSON.parse(JSON.stringify(req.body))

  for (let param of params)
    if (!GlobalUtils.hasOwnProp(body, param))
      return false

  return true
}

class Utils {
  /**
   * Prevents access to route by checking user's role. Default behaviour is to
   * return a standard response to the client. Passing true for redirect
   * overrides this behaviour and forces a redirect instead.
   */
  static authorise = (
    authorisedRoles: Role[],
    redirect = false,
  ) => (req: Req, res: Res, next: Next) => {
    !isAuthorised(req, authorisedRoles)
      ? redirect
        ? res.redirect('/')
        : Utils.handleError(res, new Error(messages.UNAUTHORISED))
      : next()
  }

  /**
   * Middleware ensures params provided as strings in array exist in req.body
   * Should only include required params, optional params should be handled
   * separately in route
   */
  static requireParams(...params: string[]) {
    return (req: Req, res: Res, next: Next) => (
      !ensureParamsDefined(req, params)
        ? this.handleError(res, new Error(messages.STANDARD_ERROR))
        : next()
    )
  }

  static handleSuccess(res: Res, payload: any = null) {
    return res.send(new Response(false, payload))
  }

  static handleError(res: Res, error: Error | string) {
    return res.send(
      new Response(true, error instanceof Error ? error.message : error),
    )
  }

  static mergeToPreloadedState = (req: Req, state: Record<string, any>) => {
    req.preloadedState = {
      ...req.preloadedState,
      ...state,
    }
  }
}

export default Utils