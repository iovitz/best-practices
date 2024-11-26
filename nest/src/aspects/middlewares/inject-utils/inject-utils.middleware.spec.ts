import { InjectUtilsMiddleware } from './inject-utils.middleware'

describe('injectUtilsMiddleware', () => {
  it('should be defined', () => {
    expect(new InjectUtilsMiddleware()).toBeDefined()
  })
})
