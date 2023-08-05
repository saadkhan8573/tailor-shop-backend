// email-verification.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserStatus } from 'src/user/enum';

@Injectable()
export class UserApprovedStatusGaurd implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user.status !== UserStatus.APPROVED) {
      throw new UnauthorizedException('User Status is not approved');
    }
    return true;
  }
}
