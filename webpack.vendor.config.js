const path = require('path')
const webpack = require('webpack')
const mode = process.env.NODE_ENV

const config = {
  mode: mode,
  devtool: mode === 'development' ? 'source-map' : false,

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules'],
  },

  entry: {
    'vendor': [
      'axios',
      'qs',
      'react',
      'react-dom',
      'react-helmet-async',
      'react-router-dom',
      'redux',
      'redux-logger',
      'redux-thunk',
      'reselect',
      'slugify',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'static'),
    filename: `[name]${mode === 'development' ? '.dev' : ''}.dll.js`,
    library: '[name]',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname) + `/static/[name]${mode === 'development' ? '.dev' : ''}.json`,
      name: '[name]',
    }),
  ],
}

module.exports = config