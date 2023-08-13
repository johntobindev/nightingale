const env = process.env.NODE_ENV || 'production'

export default (html: string, preloadedState: any, helmet: any, nonce: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="">

    <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon/favicon-16x16.png">
    <link rel="manifest" href="/static/icons/favicon/site.webmanifest">
    <link rel="mask-icon" href="/static/icons/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/static/icons/favicon/favicon.ico">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-config" content="/static/icons/favicon/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Raleway:wght@700&display=swap" rel="stylesheet">

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round" rel="stylesheet">
    <script src="https://kit.fontawesome.com/4f2cf636a7.js" crossorigin="anonymous"></script>

    ${helmet.title.toString()}
    ${env === 'production' ? '<link rel=\'stylesheet\' type=\'text/css\' href=\'/static/main.css\'>' : ''}
  </head>
  <body>
    <div id="root">
      <div>${html}</div>
    </div>

    <script nonce="${nonce}">window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}</script>
    <script src="/static/vendor${env === 'development' ? '.dev' : ''}.dll.js"></script>
    <script src="/static/${env === 'production' ? 'bundle' : 'hmrBundle'}.js"></script>
  </body>
  </html>
`