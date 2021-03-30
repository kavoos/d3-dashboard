import { isProd } from '../utils/env'
import { arrayFilterEmpty } from '../utils/helpers'

module.exports = () => {
  const plugins = arrayFilterEmpty([
    'postcss-import',
    'tailwindcss',
    'autoprefixer',
    isProd ? 'cssnano' : null
  ])
  return {
    plugins
  }
}