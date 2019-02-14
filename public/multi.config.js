var path = require('path');

module.exports = {
  entry: './js/multi.js',
  output: {
    filename: 'multi.js',
    path: path.resolve(__dirname, 'dist')
  }
};