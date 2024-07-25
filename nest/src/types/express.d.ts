export {};

declare global {
  namespace Express {
    export interface Request {
      user?: any;
      userId?: string;
      skipFormat?: boolean;

      tracer?: {
        id: string;
      };
    }
  }
}
