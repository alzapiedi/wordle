
const path = require('path')

module.exports = {
  entry: {
    solver: './solver.js',
    wordle: './wordle.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules','./']
  },
  devServer: {
    static: './dist',
   hot: true,
  },
};