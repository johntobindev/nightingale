const crypto = require('crypto')

module.exports = (localName, resourcePath) => {
  const getHash = value => crypto.createHash('sha256').update(value).digest('hex')
  const hash = getHash(`${resourcePath}${localName}`).slice(0, 5)
  return `${localName}__${hash}`
}