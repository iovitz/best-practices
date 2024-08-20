import { RequestTracerMiddleware } from './request-tracer.middleware';

describe('RequestTracerMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestTracerMiddleware()).toBeDefined();
  });
});
