module.exports = {
  parser: 'babel-eslint',
  'extends': './node_modules/fbjs-scripts/eslint/.eslintrc.js',
  plugins: [
    'react',
  ],
  globals: {
    ReactComponent: true,
    React$Component: true,
    ReactClass: true,
    React$Element: true,
  },
  rules: {
    'object-curly-spacing': [2, 'never'],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  },
};
