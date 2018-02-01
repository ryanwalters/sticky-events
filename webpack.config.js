
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/sticky-events.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'sticky-events.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'observeStickyEvents',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ],
  },
};
