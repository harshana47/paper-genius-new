/* eslint-env jest */
const mockAsyncStorage = require('@react-native-async-storage/async-storage/jest/async-storage-mock');

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    BASE_URL: 'https://example.com',
  },
}));
