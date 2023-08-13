const avatars = [
  'alien',
  'anubis',
  'squid',
  'snowman',
]

class Avatars {
  static get avatars() {
    return avatars
  }

  static getRandomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)]

  static avatarExists = (avatar: string) => avatars.includes(avatar)
}

export default Avatars