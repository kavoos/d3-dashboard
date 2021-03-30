import { babelLoader } from './useLoaderRuleItems'

export const typescriptRule = {
  test: /\.tsx?$/,
  loader: 'ts-loader',
  options: {
    transpileOnly: true
  },
  exclude: /node_modules/
}

export const javascriptRule = {
  test: /\.(js|jsx)$/,
  use: [babelLoader],
  exclude: /node_modules/
}

export const htmlRule = {
  test: /\.(html)$/,
  use: {
    loader: 'html-loader'
  }
}


export const imagesRule = {
  test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
  type: 'asset/resource'
}

export const fontsRule = {
  test: /\.(woff(2)?|eot|ttf|otf|)$/,
  type: 'asset/inline'
}