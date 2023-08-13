import Utils from './Utils'

interface Roles {
  member: 'member',
  administrator: 'administrator',
}

export type Role = Roles[keyof Roles]

const roles: Roles = {
  member: 'member',
  administrator: 'administrator',
}

function isKeyOfRoles(value: any): value is keyof Roles {
  return Utils.hasOwnProp(roles, value)
}

const rolesArray = Object.keys(roles).filter(isKeyOfRoles).map(key => roles[key])

function isRole(value: any): value is Role { 
  return rolesArray.includes(value)
}

class Auth {
  static get roles() {
    return roles
  }

  static isAuthorised = (userRoles: Role[], authorisedRoles: Role[]) => (
    userRoles.filter(role => authorisedRoles.includes(role)).length !== 0
  )

  static stringRolesToArray = (rolesString: string): Role[] => {
    // 0 length string = no roles, return empty array
    if (rolesString.length === 0) return []
    let rolesArray = rolesString.split(',')
    return rolesArray.filter(isRole)
  }
}

export default Auth