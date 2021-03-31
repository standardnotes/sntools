const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(config, {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/
    })]
  }
});
