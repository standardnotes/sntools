const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'sntools.js': './lib/sntools.js'
  },
  resolve: {
    extensions: ['.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './[name]',
    library: 'SNTools',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: '/dist/',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js)?$/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunks: ['sntools']
    })
  ]
};
