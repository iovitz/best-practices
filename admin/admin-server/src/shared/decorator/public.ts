import { SetMetadata } from '@nestjs/common';
import { PUBLIC_INTERFACE } from '../constans/meta-keys';

// 可以公开访问的接口
export const Public = () => {
  return SetMetadata(PUBLIC_INTERFACE, true);
};
