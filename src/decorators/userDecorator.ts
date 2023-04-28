import { createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
