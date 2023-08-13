import sass from 'sass'
import generateScopedName from '../../css-modules/generateScopedName'

module.exports = {
  generateScopedName,
  extensions: ['.css', '.scss'],
  preprocessCss: (data, file) => sass.renderSync({ data, file }).css,
}