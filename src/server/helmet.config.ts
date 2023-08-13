import helmet from 'helmet'

const options = (nonce: string): Parameters<typeof helmet>[0] => ({
  contentSecurityPolicy: {
    directives: {
      connectSrc: ['\'self\'', 'https://*.fontawesome.com', 'https://fonts.gstatic.com'],
      defaultSrc: ['\'self\'', 'blob:', 'data:'],
      fontSrc: ['\'self\'', 'https://*.fontawesome.com', 'https://fonts.gstatic.com'],
      objectSrc: ['\'none\''],
      scriptSrc: ['\'self\'', `'nonce-${nonce}'`, 'https://*.fontawesome.com', 'https://fonts.gstatic.com'],
      styleSrc: ['\'self\'', 'https: \'unsafe-inline\'', 'https://*.fontawesome.com', 'https://fonts.gstatic.com'],
    },
  },
})

export default options