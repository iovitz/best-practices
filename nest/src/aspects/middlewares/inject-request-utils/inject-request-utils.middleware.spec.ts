import { InjectRequestUtilsMiddleware } from './inject-request-utils.middleware';

describe('InjectRequestUtilsMiddleware', () => {
  it('should be defined', () => {
    expect(new InjectRequestUtilsMiddleware()).toBeDefined();
  });
});
