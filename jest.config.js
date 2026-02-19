module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-safe-area-context|@react-navigation|react-redux|@reduxjs/toolkit|redux|immer|reselect|react-native-size-matters)/)',
  ],
};
