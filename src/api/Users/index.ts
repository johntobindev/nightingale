import { auk as pool } from '../../server/databases/connections'
import messages from '../../global/messages'
import Avatars from '../Avatars'
import Auth from '../../global/Auth'
import Utils from '../../global/Utils'
import { User } from '../../client/state/session/types'
import { RowDataPacket } from 'mysql2/promise'

type UserSettings = Pick<User, 'username' | 'avatar'>

type UserId = string

class Users {
  static getUser = async (userId: UserId): Promise<User> => {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT     username, 
                   avatar, 
                   GROUP_CONCAT(Roles.name) AS roles
        FROM       Users
        INNER JOIN RolesUsers
        ON         RolesUsers.user_id = Users.id
        INNER JOIN Roles
        ON         Roles.id = RolesUsers.role_id
        WHERE      Users.auth0_id = ?
      `, [userId])

      let user = rows[0]

      if (!user) throw new Error(messages.STANDARD_ERROR)

      user.roles = Auth.stringRolesToArray(user.roles)

      return user as User
    } catch (error) {
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static addUser = async (userId: UserId): Promise<void> => {
    try {
      await pool.query(`
        INSERT INTO Users (auth0_id, username, avatar)
        VALUES      (?, ?, ?)                  
      `, [userId, 'username', Avatars.getRandomAvatar()])
    } catch (error) {
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static userExists = async (userId: UserId): Promise<boolean> => {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT auth0_id 
        FROM   Users 
        WHERE  auth0_id = ?
      `, [userId])

      if (rows.length > 0 && Utils.hasOwnProp(rows[0], 'auth0_id'))
        return true

      return false
    } catch (error) {
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static updateUser = async (userId: UserId, settings: UserSettings): Promise<void> => {
    try {
      await pool.query(`
        UPDATE Users
        SET    username = ?,
               avatar = ?
        WHERE  auth0_id = ?
      `, [settings.username, settings.avatar, userId])
    } catch (error) {
      throw new Error(messages.STANDARD_ERROR)
    }
  }
}

export default Users