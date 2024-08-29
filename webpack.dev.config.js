const path = require('path');
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-dev', {
  resolve: {
    alias: {
      views: path.resolve(__dirname, 'src/views'),
      shared: path.resolve(__dirname, 'src/shared'),
      constants: path.resolve(__dirname, 'src/constants'),
      helpers: path.resolve(__dirname, 'src/helpers'),
    },
    extensions: ['.js', '.jsx'],
  },
});
