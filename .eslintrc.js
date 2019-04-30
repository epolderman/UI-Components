module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/tslint', 'react-hooks'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2018
  },
  rules: {
    '@typescript-eslint/tslint/config': [
      'warn',
      {
        lintFile: './tslint.json' // path to tslint.json of your project
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  }
};
