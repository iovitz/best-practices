import antfu from '@antfu/eslint-config'

export default antfu({
  javascript: {
    overrides: {
      'no-undef': 0,
      'no-throw-literal': 'off',
    },
  },
  rules: {
    'node/prefer-global/process': 'off',
  },
}, {
  ignores: ['assets/*', 'node_modules/*', 'views/*', '**/*.yaml'],
})
