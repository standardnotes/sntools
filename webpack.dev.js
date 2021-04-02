const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');
const path = require("path");

module.exports = merge(config, {
  mode: 'development',
  stats: {
    colors: true
  },
  devServer: {
    port: 8001,
    historyApiFallback: true,
    contentBase: path.join(__dirname),
    watchContentBase: true,
    watchOptions: { aggregateTimeout: 800, poll: 1000 },
  }
});
