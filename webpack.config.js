const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'

  return {
    mode: mode || 'development',
    entry: {
      app: './web/js/index.js',
      login: './web/js/login.js'
    },
    output: {
      path: path.join(__dirname, '/src/public'),
      filename: '[name].bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          use: 'babel-loader',
          test: /\.jsx?$/,
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    optimization: {
      // minimize: false
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'web/views/app.html'),
        links: mode === 'production' ? [{ rel: 'stylesheet', type: 'text/css', href: 'app.css' }] : [],
        filename: path.join(__dirname, '/src/public/index.html'),
        chunks: ['app'],
        hash: true
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'web/views/app.html'),
        links: mode === 'production' ? [{ rel: 'stylesheet', type: 'text/css', href: 'login.css' }] : [],
        filename: path.join(__dirname, '/src/public/login.html'),
        chunks: ['login'],
        hash: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode)
      })
    ],
    devServer: {
      historyApiFallback: true,
      disableHostCheck: true
    }
  }
}
