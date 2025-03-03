import antfu from '@antfu/eslint-config'

export default antfu({
  javascript: {
    overrides: {
      'no-undef': 0,
      'node/prefer-global/process': 'off',
    },
  },
  rules: {
    'node/prefer-global/process': 'off',
  },
}, {
  ignores: ['assets/*', 'node_modules/*', 'views/*', '**/*.yaml'],
})
