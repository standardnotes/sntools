const path = require('path');

module.exports = {
  entry: {
    'sntools': './lib/sntools.js',
    'sntools.min': './lib/sntools.js',
  },
  resolve: {
    extensions: ['.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(ts)?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                ["@babel/preset-env"]
              ]
            }
          }
        ]
      }
    ]
  }
};
