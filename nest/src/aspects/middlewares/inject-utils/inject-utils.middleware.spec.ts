import { InjectUtilsMiddleware } from './inject-utils.middleware';

describe('InjectUtilsMiddleware', () => {
  it('should be defined', () => {
    expect(new InjectUtilsMiddleware()).toBeDefined();
  });
});
