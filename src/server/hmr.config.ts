import webpack from 'webpack'
import config from '../../webpack.config'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

const compiler = webpack(config)

export default (app) => {
  app.use(devMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }))

  app.use(hotMiddleware(compiler, {
    heartbeat: 1000,
  }))
}