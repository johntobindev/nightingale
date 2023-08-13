import Users from '../../../api/Users'
import Validator from '../../../api/Users/Validator'
import Utils from '../Utils'
import Auth from '../../../global/Auth'
import messages from '../../../global/messages'
import { Application as App } from 'express'

export default (app: App) => {
  app.post(
    '/user/settings/get',
    Utils.authorise([Auth.roles.member]),
    async (req, res) => {
      if (req.user === undefined)
        return Utils.handleError(res, new Error(messages.STANDARD_ERROR))

      const { user_id: userId } = req.user

      try {
        const settings = await Users.getUser(userId)
        Utils.handleSuccess(res, settings)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )

  app.post(
    '/user/settings/update',
    Utils.authorise([Auth.roles.member]),
    Utils.requireParams('username', 'avatar'),
    async (req, res) => {
      if (req.user === undefined || req.session.passport === undefined)
        return Utils.handleError(res, new Error(messages.STANDARD_ERROR))

      const { user_id: userId } = req.user
      let { username, avatar } = req.body
      const settings = { username, avatar }

      try {
        Validator.validateSettings(settings)
        await Users.updateUser(userId, settings)
        const user = await Users.getUser(userId)
        req.session.passport.user.appUser = user
        Utils.handleSuccess(res, user)
      } catch (error) {
        Utils.handleError(res, error)
      }
    },
  )
}