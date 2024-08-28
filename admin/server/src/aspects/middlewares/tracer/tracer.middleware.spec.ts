import { TracerMiddleware } from './tracer.middleware';

describe('TracerMiddleware', () => {
  it('should be defined', () => {
    expect(new TracerMiddleware()).toBeDefined();
  });
});
