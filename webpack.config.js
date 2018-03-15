
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './sticky-events.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'sticky-events.es5.js',
    libraryTarget: 'umd',
    library: 'StickyEvents',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ],
  },
  plugins: [
    new UglifyJSPlugin(),
  ],
};
