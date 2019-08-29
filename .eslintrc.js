module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['react-hooks'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2018
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  // Tells eslint-plugin-react to automatically detect the version of React to use
  settings: {
    react: {
      version: 'detect'
    }
  }
};
