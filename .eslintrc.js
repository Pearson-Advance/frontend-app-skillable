const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
  'rules': {
    'import/prefer-default-export': 'off',
    "react/require-default-props": "off"
  },
  'settings': {
    'import/resolver': {
      'node': {
        'paths': ['src'],
      },
    },
  },
});
