import slugify from 'slugify'
import qs from 'qs'

class Utils {
  /**
   * Returns a random number of the provided length
   */
  static getRandomNumber = (length: number) => {
    let randomNumber = ''

    for (let i = 0; i < length; i++)
      randomNumber += String(Math.floor(Math.random() * 10))

    return Number(randomNumber)
  }

  static getStyleName = (style: any, name: string, test: boolean, append: string) => {
    if (!test) return style[name]
    else return style[name] + ' ' + style[append]
  }

  /**
   * Compare two objects' shared properties, returning true or false if they all
   * do or do not equal the same values. An array of ignoredKeys can be added -
   * these keys/properties will not be compared.
   */
  static sharedPropertiesEqual(
    oldObject: {},
    newObject: {},
    ignoredKeys: string[] = [],
  ) {
    for (let key in oldObject) {
      if (
        !this.hasOwnProp(oldObject, key) ||
        !this.hasOwnProp(newObject, key) ||
        ignoredKeys.includes(key)
      )
        continue

      if (String(oldObject[key]) === String(newObject[key]))
        continue

      return false
    }
    return true
  }

  static removeUnnecessaryWhitespace = (string: string) => (
    string.replace(/\s\s+/g, ' ').trim()
  )

  static slugify = (string: string) => (
    slugify(string, { remove: /[^\w\s-]/, lower: true })
  )

  static getDaysForMonthOfYear = (year: number, month: number) => (
    new Date(year, month, 0).getDate()
  )

  static getDayStringsArray = (year: number, month: number) => {
    let days: string[] = []
    const numDays = Utils.getDaysForMonthOfYear(year, month)

    for (let i = 1; i <= numDays; i++)
      days.push((i < 10 ? '0' : '') + String(i))

    return days
  }

  static getDateString = (year: number, month: number, day: number) => {
    let yearStr = String(year)
    let monthStr = String(month)
    let dayStr = String(day)

    if (monthStr.length < 2) monthStr = '0' + monthStr
    if (dayStr.length < 2) dayStr = '0' + dayStr

    return yearStr + '-' + monthStr + '-' + dayStr
  }

  /**
   * Returns the year/month/day as a number from a dateString
   *
   * @param dateString Must be in the form YYYY-MM-DD
   * @param part
   * @returns {number}
   */
  static extractNumberFromDateString = (
    dateString: string,
    part: string,
  ) => {
    if (part === 'year')
      return Number(dateString.substr(0, 4))

    if (part === 'month')
      return Number(dateString.substr(5, 2))

    return Number(dateString.substr(8, 2))
  }

  static convertToString = (value: any) => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    if (typeof value === 'boolean') return value ? 'true' : 'false'

    return ''
  }

  static getQuery = (location: Location) => qs.parse(
    location.search,
    { ignoreQueryPrefix: true },
  )

  static ordinal = (number: number) => {
    let string = String(number)

    // Exception check
    if (['11', '12', '13'].includes(string))
      return string += 'th'

    const lastLetter = string.charAt(string.length - 1)

    switch (lastLetter) {
      case '1':
        string += 'st'
        break

      case '2':
        string += 'nd'
        break

      case '3':
        string+= 'rd'
        break

      default:
        string += 'th'
    }

    return string
  }

  static pageChanged = (oldPage: number, newPage: number) => {
    if (!isNaN(oldPage)) oldPage = Number(oldPage)
    if (!isNaN(newPage)) newPage = Number(newPage)

    return oldPage !== newPage
  }

  static objectsChanged = (oldObject: Record<any, any>, newObject: Record<any, any>) => {
    for (let key of Object.keys(oldObject))
      if (oldObject[key] !== newObject[key])
        return true

    for (let key of Object.keys(newObject))
      if (newObject[key] !== oldObject[key])
        return true

    return false
  }

  static secondsToHoursMinutesSeconds = (secondsArg: string | number): string => {
    secondsArg = Number(secondsArg)

    const seconds = secondsArg % 60
    const secondsString = seconds < 10 ? '0' + String(seconds) : String(seconds)

    if (secondsArg < 60) return '0:' + secondsString

    if (secondsArg < 3600) return (secondsArg - seconds) / 60 + ':' + secondsString
    
    const hours = (secondsArg - (secondsArg % 3600)) / 3600
    
    const minutes = (secondsArg - (hours * 3600) - seconds) / 60
    let minutesString = ''
    if (minutes < 10) minutesString = '0' + String(minutes)

    return hours + ':' + minutesString + ':' + secondsString
  }

  static isInteger = (number: any, allowZero = false, allowNegatives = false) => {
    if (!['string', 'number'].includes(typeof number)) 
      return false

    if (isNaN(number)) 
      return false

    number = Number(number)

    if (!Number.isInteger(number))
      return false

    if (!allowZero && number === 0)
      return false

    if (!allowNegatives && number < 0)
      return false

    return true
  }

  static hasOwnProp = (object: {}, prop: string) => (
    Object.prototype.hasOwnProperty.call(object, prop)
  )
}

export default Utils