import { RequestTracerInterceptor } from './request-tracer.interceptor';

describe('RequestTracerInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestTracerInterceptor()).toBeDefined();
  });
});
