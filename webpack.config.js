const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const mode = process.env.NODE_ENV
const generateScopedName = require('./css-modules/generateScopedName')

let config = {
  mode: mode,
  devtool: mode === 'development' ? 'source-map' : false,

  entry: ['./src/client/entry.tsx'],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static'),
    publicPath: '/static/',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
  },

  context: path.resolve(__dirname),

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                getLocalIdent: ({ resourcePath }, _, localName) => generateScopedName(localName, resourcePath),
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(__dirname) + `/static/vendor${mode === 'development' ? '.dev' : ''}.json`),
    }),
  ],

  optimization: {},
  stats: 'errors-warnings',
}

if (mode === 'development') {
  config.entry.unshift('webpack-hot-middleware/client')
  config.output.filename = 'hmrBundle.js'
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.watchOptions = {
    aggregateTimeout: 300,
    poll: 1000,
  }
  config.optimization.moduleIds = 'named'
}

if (mode === 'production') {
  config.plugins.push(new MiniCssExtractPlugin())
}

module.exports = config