const path = require('path');
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-prod', {
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'src/common'),
      views: path.resolve(__dirname, 'src/views'),
      xtremeLabsViews: path.resolve(__dirname, 'src/xtreme-labs-views'),
      shared: path.resolve(__dirname, 'src/shared'),
      constants: path.resolve(__dirname, 'src/constants'),
      helpers: path.resolve(__dirname, 'src/helpers'),
    },
    extensions: ['.js', '.jsx'],
  },
});
