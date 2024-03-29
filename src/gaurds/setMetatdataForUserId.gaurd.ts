import {
  SetMetadata,
  ExecutionContext,
  Injectable,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function setDynamicMetadata(data: any) {
  return data?.id;
}

export const UserId = (id: any) => {
  return SetMetadata('userid', id);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<any>('userid', context.getHandler());
    // if (!roles) {
    //   return true;
    // }
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    // return matchRoles(roles, user.roles);
    return true;
  }
}
