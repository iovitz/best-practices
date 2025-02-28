import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    overrides: {
      'ts/consistent-type-imports': 0,
    },
  },

}, {
  ignores: ['prisma/*', 'node_modules/*', 'drizzle/*.json', '**/*.yaml'],
})
