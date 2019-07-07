const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Critters = require('critters-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isDev ? 'development' : 'production',
  bail: isProd,
  devtool: isDev ? 'cheap-module-source-map' : false,

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    hot: false,
    open: true,
    stats: 'normal',
    port: 3000,
  },

  entry: ['./src/index.js'],

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: isProd ? '[name].[contenthash:8].js' : 'bundle.js',
    chunkFilename: isProd
      ? '[name].[contenthash:8].chunk.js'
      : '[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        // exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },

  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[id].css',
    }),

    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public', 'index.html'),
      ...(isProd && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    isProd &&
      new Critters({
        // Outputs: <link rel="preload" onload="this.rel='stylesheet'">
        preload: 'swap',
        // Don't inline critical font-face rules, but preload the font URLs:
        preloadFonts: true,
      }),
  ].filter(Boolean),
}
