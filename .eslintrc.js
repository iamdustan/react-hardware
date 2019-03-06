module.exports = {
  parser: 'babel-eslint',
  'extends': './node_modules/fbjs-scripts/eslint/.eslintrc.js',
  plugins: [
    'react',
  ],
  rules: {
    'object-curly-spacing': [2, 'never'],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  },
};
